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


let connector;
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
      config = (config) ? merge(defaultConfig, config) : defaultConfig
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

export { setLogger };
