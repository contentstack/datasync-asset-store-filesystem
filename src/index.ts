/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug'
import { compact, merge } from 'lodash'
import { join } from 'path'
import { defaultConfig } from './config'
import { FSAssetStore } from './filesystem'

let assetStoreConfig
let assetStoreInstance

export const getAssetLocation = (asset, config) => {
  const values: any = []
  const keys: string[] = assetStoreConfig.contentstack.branch ? compact(config.patternWithBranch.split('/')) : compact(config.pattern.split('/'));

  if (config.assetFolderPrefixKey && typeof config.assetFolderPrefixKey === 'string') {
    values.push(config.assetFolderPrefixKey)
  }

  const regexp = new RegExp('https://(assets|images|dev-assets|dev-images|stag-assets|stag-images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
  let matches

  // tslint:disable-next-line: no-conditional-assignment
  while ((matches = regexp.exec(asset.url)) !== null) {
    if (matches && matches.length) {
      if (matches[2]) {
        asset.apiVersion = matches[2]
      }
      if (matches[3]) {
        asset.apiKey = matches[3]
      }
      if (matches[4]) {
        asset.downloadId = matches[4]
      }
    }
  }

  for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
    if (keys[i].charAt(0) === ':') {
      const k = keys[i].substring(1)
      if (asset[k]) {
        values.push(asset[k])
      } else {
        throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
      }
    } else {
      values.push(keys[i])
    }
  }

  return join.apply(this, values)
}

export const getFileLocation = (asset, config) => {
  const values: any = []
  const keys: string[] = compact(config.baseDir.split('/'))
  const dir: string[] = assetStoreConfig.contentstack.branch ? compact(config.patternsWithBranch.split('/')) : compact(config.pattern.split('/'));
  keys.concat(dir);
   
  if (config.assetFolderPrefixKey && typeof config.assetFolderPrefixKey === 'string') {
    values.push(config.assetFolderPrefixKey)
  }

  const regexp = new RegExp('https://(assets|images|dev-assets|dev-images|stag-assets|stag-images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
  let matches

  // tslint:disable-next-line: no-conditional-assignment
  while ((matches = regexp.exec(asset.url)) !== null) {
    if (matches && matches.length) {
      if (matches[2]) {
        asset.apiVersion = matches[2]
      }
      if (matches[3]) {
        asset.apiKey = matches[3]
      }
      if (matches[4]) {
        asset.downloadId = matches[4]
      }
    }
  }

  for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
    if (keys[i].charAt(0) === ':') {
      const k = keys[i].substring(1)
      if (asset[k]) {
        values.push(asset[k])
      } else {
        throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
      }
    } else {
      values.push(keys[i])
    }
  }

  return values
}

export const setConfig = (config) => {
  assetStoreConfig = config
}

export const getConfig = () => {
  return assetStoreConfig
}

export { assetStoreInstance }

const debug = Debug('asset-store-filesystem')
/**
 * @description to start the asset connector
 * @param {object} config Optional app config
 * @example
 * import { start } from '@contentstack/datasync-asset-store-filesystem'
 * const assetStore = start(config)
 *  .then()
 *  .catch()
 * 
 * return assetStore.download(asset)
 * return assetStore.unpublish(asset)
 * 
 * @return {FSAssetStore}
 */
export function start(config) {

  return new Promise((resolve, reject) => {
    try {
      assetStoreConfig = (config) ? merge(defaultConfig, config) : defaultConfig
      assetStoreInstance = new FSAssetStore(assetStoreConfig)
      return resolve(assetStoreInstance)
    } catch (error) {
      debug('Failed to load content-store due to', error)
      reject(error)
    }
  })
}
