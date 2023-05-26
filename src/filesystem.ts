/*!
 * contentstack-sync-asset-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

import {
  debug as Debug,
} from 'debug'
import {
  createWriteStream,
  existsSync,
} from 'fs'
import {
  cloneDeep,
} from 'lodash'
import mkdirp from 'mkdirp'
import {
  join,
  resolve as resolvePath,
} from 'path'
import request from 'request'
import rimraf from 'rimraf'
import {
  getAssetLocation,
  getFileLocation,
} from './index'
import {
  validatePublishAsset,
  validateUnPublishAsset,
} from './utils'

const debug = Debug('asset-store-filesystem')
if (
  process.env.DEBUG === "*" ||
  (process.env.DEBUG || "").includes("asset-store-filesystem")
) {
  debug.enabled = true;
}

interface IAsset {
  locale: string,
    url: string,
    uid: string,
    // created/calculated from the pattern keys provided
    _internal_url ?: string,
    // apiVersion, apiKey and download_id are calculated from asset's url
    apiVersion ?: string,
    apiKey ?: string,
    download_id ?: string,
    // calculated from asset url when asset is of type RTE
    filename ?: string,
    // does not exist in RTE/Markdown assets
    title ?: string,
    [propName: string]: any,
}

/**
 * @class
 * @private
 * @summary Class that downloads and deletes assets from FS DB
 * @example
 * const assetStore = new FSAssetStore(config)
 * return assetStore.download(asset)
 *  .then()
 *  .catch()
 * @returns {FSAssetStore}
 */
export class FSAssetStore {
  private readonly config: any

  constructor(config) {
    this.config = config.assetStore
  }

  /**
   * @public
   * @method download
   * @description Downloads the asset object onto local fs
   * @param  {object} asset Asset object details
   * @returns {Promise} returns the asset object, if successful.
   */
  public download(asset) {
    debug('Asset download invoked ' + JSON.stringify(asset))

    return new Promise((resolve, reject) => {
      try {
        validatePublishAsset(asset)

        return request.get({
            url: encodeURI(asset.url),
          })
          .on('response', (resp) => {
            if (resp.statusCode === 200) {
              if (asset.hasOwnProperty('download_id')) {
                const attachment = resp.headers['content-disposition']
                asset.filename = decodeURIComponent(attachment.split('=')[1])
              }
              asset._internal_url = getAssetLocation(asset, this.config)
              const filePathArray = getFileLocation(asset, this.config)
              const folderPathArray = cloneDeep(filePathArray)
              folderPathArray.splice(folderPathArray.length - 1)
              const folderPath = resolvePath(join.apply(this, folderPathArray))
              const filePath = resolvePath(join.apply(this, filePathArray))

              if (!existsSync(folderPath)) {
                mkdirp.sync(folderPath, '0755')
              }
              const localStream = createWriteStream(filePath)
              resp.pipe(localStream)
              localStream.on('close', () => {
                return resolve(asset)
              })
            } else {
              return reject(`Failed to download asset ${JSON.stringify(asset)}`)
            }
          })
          .on('error', reject)
          .end()
      } catch (error) {
        debug(`${asset.uid} asset download failed`)

        return reject(error)
      }
    })
  }

  /**
   * @private
   * @method delete
   * @description Delete the asset from fs db
   * @param {array} assets Assets to be deleted
   * @returns {Promise} returns the asset object, if successful.
   */
  public delete(assets: IAsset[]) {
    debug('Asset deletion called for', JSON.stringify(assets))
    const asset = assets[0]

    return new Promise((resolve, reject) => {
      try {
        validateUnPublishAsset(asset)
        const folderPathArray = getFileLocation(asset, this.config)
        folderPathArray.splice(folderPathArray.length - 1, 1)

        const folderPath = resolvePath(join.apply(this, folderPathArray))
        if (existsSync(folderPath)) {

          return rimraf(folderPath, (error) => {
            if (error) {
              debug(`Error while removing ${folderPath} asset file`)

              return reject(error)
            }

            return resolve(asset)
          })
        } else {
          debug(`${folderPath} did not exist!`)

          return resolve(asset)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @private
   * @method unpublish
   * @description Unpublish the asset from filesystem
   * @param  {object} asset Asset to be unpublished
   * @returns {Promise} returns the asset object, if successful.
   */
  public unpublish(asset: IAsset) {
    debug(`Asset unpublish called ${JSON.stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateUnPublishAsset(asset)
        const filePathArray = getFileLocation(asset, this.config)
        const filePath = resolvePath(join.apply(this, filePathArray))
        if (existsSync(filePath)) {
          return rimraf(filePath, (error) => {
            if (error) {
              debug(`Error while removing ${filePath} asset file`)

              return reject(error)
            }

            return resolve(asset)
          })
        }
        debug(`${filePath} did not exist!`)

        return resolve(asset)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
