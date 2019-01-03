import { existsSync } from 'fs'
import { join } from 'path'
import { get , build} from './config'
import { render } from './util'
import { messages as msg } from './util/messages'

let asset_manager = null

export function start (config) {
	return new Promise((resolve, reject)=>{
		build(config)
		const asset_config = get('asset-connector')
		//console.log(asset_config,"configgggggggggggggggggggggggggggggg", __dirname)
		const am_path = join(__dirname, asset_config.type + '.js')
		//console.log(am_path,"am_patham_patham_patham_patham_patham_patham_patham_path", asset_config,"asset_config")
		if (existsSync(am_path)) {
			const AssetManager = require(am_path).FsManager
			//console.log(AssetManager, "assetmanagerrrrrrrrrrrrrrrrrrrrr")
			asset_manager = new AssetManager(asset_config)
			resolve(asset_manager) 
		} else {
			console.error(render(msg.error.asset_manager_failed, { type: asset_config.type }))
			reject()
		}
		//console.log(asset_manager,"asset_managerasset_managerasset_managerasset_managerasset_manager")
		
	}).catch((error)=>{
		console.error(error)
	})
}