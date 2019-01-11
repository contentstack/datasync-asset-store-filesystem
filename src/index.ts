/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { existsSync } from 'fs'
import { join } from 'path'
import { messages as msg } from './util/messages'
import {setLogger, logger } from "./logger";
import { debug as Debug } from "debug";
import { defaultConfig } from './config/default';


let asset_manager = null
const debug = Debug("asset-store-filesystem");
export function start (config, customLogger? :any ) {
	try{
	return new Promise((resolve, reject)=>{
		if(config == undefined || Object.keys(config['asset-connector']).length == 0){
			console.log("inside")
			config = defaultConfig
		}
		const asset_config = config['asset-connector'] 
		const am_path = join(__dirname, asset_config.type + '.js')
		setLogger()
		if (existsSync(am_path)) {
			const AssetManager = require(am_path).FsManager
			asset_manager = new AssetManager(asset_config)
			logger.info("Asset store loaded successfully")
			debug("Asset store loaded successfully")
			resolve(asset_manager) 
		} else {
			debug(msg.error.asset_manager_failed)
			logger.error(msg.error.asset_manager_failed);
			reject()
		}
	})
	}
	catch(error){
		debug(msg.error.asset_manager_failed)
		logger.error(msg.error.asset_manager_failed);

	}
}