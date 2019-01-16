/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { merge } from 'lodash';
import { defaultConfig } from './default';
import { FsManager } from './filesystem';
import { logger as log, setLogger } from './logger';

let connector = null;
const debug = Debug('asset-store-filesystem');
/**
 * @description to start the asset connector
 * @param  {Object} config: configs
 * @param  {Object} logger: logger instance
 */
export function start(config, logger?) {
  if (logger) {
    setLogger(logger);
  }

  return new Promise((resolve, reject) => {
    try {
      if (config) {
        config = merge(defaultConfig, config);
      }
      connector = new FsManager(config);
      resolve(connector);
    } catch (error) {
      debug('Failed to load asset-store due to', error);
      log.error('Failed to load asset-store', error);
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

export { setLogger };
