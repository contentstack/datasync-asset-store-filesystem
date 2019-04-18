/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { merge } from 'lodash';
import { defaultConfig } from './config';
import { FSAssetStore } from './filesystem';

let connector;
const debug = Debug('asset-store-filesystem');
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
      config = (config) ? merge(defaultConfig, config) : defaultConfig;
      connector = new FSAssetStore(config);
      return resolve(connector);
    } catch (error) {
      debug('Failed to load content-store due to', error);
      reject(error);
    }

  });
}
