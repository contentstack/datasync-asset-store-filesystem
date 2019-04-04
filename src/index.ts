/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { merge } from 'lodash';
import { defaultConfig } from './config';
import { FsManager } from './filesystem';

let connector;
const debug = Debug('asset-store-filesystem');
/**
 * @description to start the asset connector
 * @param  {Object} config: configs
 * @param  {Object} logger: logger instance
 */
export function start(config) {

  return new Promise((resolve, reject) => {
    try {
      config = (config) ? merge(defaultConfig, config) : defaultConfig;
      connector = new FsManager(config);
      return resolve(connector);
    } catch (error) {
      debug('Failed to load content-store due to', error);
      reject(error);
    }

  });
}
/**
 * @description to get connector instance
 */
export function getConnectorInstance() {
  return connector;
}
