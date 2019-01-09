/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { existsSync } from 'fs'
import { join } from 'path'
import { get , build} from './config'
import { render } from './util'
import { messages as msg } from './util/messages'
import LoggerBuilder from "./logger";
import { debug as Debug } from "debug";

let log
let asset_manager = null
const debug = Debug("asset-sotre-filesystem");
export function start (config,customLogger? :any ) {
	log = new LoggerBuilder(customLogger).Logger
	try{
	return new Promise((resolve, reject)=>{
		build(config)
		const asset_config = get('asset-connector')
		const am_path = join(__dirname, asset_config.type + '.js')
		if (existsSync(am_path)) {
			const AssetManager = require(am_path).FsManager
			asset_manager = new AssetManager(asset_config)
			log.info("Asset store loaded successfully")
			debug("Asset store loaded successfully")
			resolve(asset_manager) 
		} else {
			debug(msg.error.asset_manager_failed)
			log.error(msg.error.asset_manager_failed);
			reject()
		}
	})
	}
	catch(error){
		debug(msg.error.asset_manager_failed)
		log.error(msg.error.asset_manager_failed);

	}
}