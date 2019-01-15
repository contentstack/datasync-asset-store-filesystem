/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { existsSync, createWriteStream } from 'fs'
import * as path from 'path'
import * as request from 'request'
import * as mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { messages as msg } from './util/messages'
import { logger as log } from "./logger";
import { debug as Debug } from "debug";


const debug = Debug("asset-store-filesystem");

export class FsManager {
  private asset_config

  constructor(asset_config) {
    this.asset_config = asset_config
  }
  /**
   * @description to download the acutal asset and store it in fileystem
   * @param  {object} assetData: asset data 
   */
  public download(assetData) {
    debug("Asset download called for", assetData)
    return new Promise((resolve, reject) => {
      let asset_base_path: string = this.asset_config.base_dir
      let assets_path = path.join(asset_base_path, assetData.locale, 'assets')
      let asset = assetData.data
      if (!existsSync(assets_path)) {
        mkdirp.sync(assets_path, '0755')
      }
      const paths = assets_path
      const pths = this.urlFromObject(asset)
      asset._internal_url = this.getAssetUrl(pths.join('/'), paths)
      pths.unshift(paths)
      const asset_path = path.join.apply(path, pths)
      request.get({ url: asset.url }).on('response', resp => {
        if (resp.statusCode === 200) {
          if (asset.download_id) {
            let attachment = resp.headers['content-disposition']
            asset['filename'] = decodeURIComponent(attachment.split('=')[1])
          }
          const _path = asset_path.replace(asset.filename, '')
          if (!existsSync(_path)) {
            mkdirp.sync(_path, '0755')
          }
          let localStream = createWriteStream(path.join(_path, asset.filename))
          resp.pipe(localStream)
          localStream.on('close', () => {
            log.info("Asset downloaded successfully", asset)
            return resolve(asset)
          })
        } else {
          log.error(msg.error.asset_download, asset);
          return reject()
        }
      })
        .on('error', reject)
        .end()
    })
      .catch((error) => {
        log.error(msg.error.asset_download, assetData);
        debug(msg.error.asset_download, assetData)
        console.error(error, "eorrrrrr")
      })

  }
  /**
   * @description to delete the asset from the filesystem
   * @param  {object} asset: asset data
   */
  public delete(asset) {
    debug("Asset deletion called for", asset)

    return new Promise((resolve, reject) => {
      let asset_base_path: string = this.asset_config.base_dir
      let assets_path = path.join(asset_base_path, asset.locale, 'assets')
      const asset_folder_path = path.join(assets_path, asset.uid)
      if (typeof asset_folder_path == "string") {
        if (existsSync(asset_folder_path)) {
          rimraf(asset_folder_path, error => {
            if (error) {
              debug("Error while removing", asset_folder_path, "asset file");
              return reject(error)
            }
            debug("Asset deleted successfully")
            return resolve(asset)
          })
        } else {
          debug(`${asset_folder_path} did not exist!`)
          log.info(`${asset_folder_path} did not exist!`)
          return resolve(asset)
        }
      } else {
        debug(`${asset_folder_path} did not exist!`)
        log.info(`${asset_folder_path} did not exist!`)
        return resolve(asset)
      }
    })

  }
  /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset: asset data
     */

  public unpublish(asset) {
    debug("asset unpublished called for", asset)
    this.delete(asset)
  }


  /**
   * @description Generate the full assets url for the given url
   * @param  {string} assetUrl
   * @param  {string} pth
   */
  private getAssetUrl(assetUrl, pth) {
    var relativeUrlPrefix = pth.split('/').reverse().slice(0, 2)
    var code = relativeUrlPrefix[1].split('-')[0]
    if (code == "en") {
      assetUrl = path.join("/", relativeUrlPrefix[0], assetUrl)
    }
    else {
      assetUrl = path.join("/", code, relativeUrlPrefix[0], assetUrl)
    }

    return assetUrl
  }



  /**
   * @description Used to generate asset path from keys using asset
   * @param  {any} asset: asset data
   */
  private urlFromObject(asset: any) {
    var values: any = [],
      _keys = ['uid', 'filename']

    for (var a = 0, _a = _keys.length; a < _a; a++) {
      if (_keys[a] === 'uid') {
        values.push(asset.uid)
      } else if (asset[_keys[a]]) {
        values.push(asset[_keys[a]])
      } else {
        debug(msg.error.asset_key_undefined)
        log.error(msg.error.asset_key_undefined);
      }
    }
    return values
  }
}




