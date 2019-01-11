// /*!
// * contentstack-sync-asset-store-filesystem
// * copyright (c) Contentstack LLC
// * MIT Licensed
// */
"use strict"
import { existsSync } from 'fs'
import { join } from 'path'
import { merge, isPlainObject } from 'lodash'
import { sync } from 'mkdirp'
import {defaultConfig} from './default'
import { ConfigInterface, UserConfigInterface } from '../util/interfaces'

 let config: ConfigInterface | any = {}

// export const build = function init (overrides: UserConfigInterface = {}) {
//   let env_config: UserConfigInterface
//   config = {
//     env: process.env.NODE_ENV || 'development',
//     path: {
//       base: process.cwd(),
//       plugins: join(process.cwd(), 'plugins')
//     }
//   }
//   const cpb = config.path.base
//   const env_config_path_js = join(cpb, 'config', config.env.toLowerCase() + '.js')
//   const env_config_path_json = join(cpb, 'config', config.env.toLowerCase() + '.json')
//   const default_config_path_js = join(cpb, 'config', 'index.js')
//   if (existsSync(env_config_path_js)) {
//     env_config = require(env_config_path_js)
//   } else if (existsSync(env_config_path_json)) {
//     env_config = require(env_config_path_js)
//   } else if (existsSync(default_config_path_js)) {
//     env_config = require(default_config_path_js)
//   } else {
//     env_config = {}
//   }
//   merge(config, defaultConfig, env_config, overrides)
//   if (config["asset-connector"] ) {
    
//     const cca = config["asset-connector"]
//     const cpb = config.path.base
//     if (isPlainObject(cca)) {
//       cca.type = cca.type || 'filesystem'
//       cca.base_dir = cca.base_dir ? join(cpb, cca.base_dir): join(cpb, '_contents')
//     }
//     // if (cca.type === 'filesystem') {
//     //   buildAssetPaths(config)
//     // }
//   }
//   return config;
// }

export const get = function getConfig(key: string) {
  let conf = key.split('.').reduce((total, current) => {
    if (total && typeof total[current] !== 'undefined') return total[current]
    return undefined
  }, config)
  return conf
}



