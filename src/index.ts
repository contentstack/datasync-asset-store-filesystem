/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { merge } from "lodash";
import { setLogger , logger as log } from "./logger";
import { debug as Debug } from "debug";
import { defaultConfig } from './default';
import { FsManager } from './filesystem'


let connector = null
const debug = Debug("asset-store-filesystem");
/**
 * @description to start the asset connector
 * @param  {Object} config: configs
 * @param  {Object} logger: logger instance
 */
export function start(config, logger?) {
	return new Promise((resolve, reject) => {
		try {
			if (config) {
				config = merge(defaultConfig,config)
				console.log(config,"caseetttttttttttttttttttttttttttttttonfig")
			} else {
			  log.info("Starting connector with default configs");
			}
			setLogger(logger)
			connector = new FsManager(config)
			resolve(connector)
		  }
		  catch (error) {
			debug('Failed to load asset-store due to', error);
			log.error('Failed to load asset-store', error);
			reject(error)
		}
	})
}
/**
 * @description Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export const setCustomLogger = (logger?) => {
  setLogger(logger)
}
