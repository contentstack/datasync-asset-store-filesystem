/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { existsSync, createWriteStream } from 'fs'
import * as path from 'path'
import { join } from 'path'
import * as request from 'request'
import * as mkdirp from 'mkdirp'
import { sync } from 'mkdirp'
import rimraf from 'rimraf'
import { messages as msg } from './util/messages'
import fs from 'fs';
import {setLogger, logger as log} from "./logger";
import { debug as Debug } from "debug";
import * as Mustache from 'mustache'


const render = Mustache.render



const debug = Debug("asset-store-filesystem");

export class FsManager {
  private asset_config
  
  constructor(asset_config) {
    this.asset_config = asset_config
    setLogger()
  }
  /**
   * @description to download the acutal asset and store it in fileystem
   * @param  {object} asset: asset data 
   * @param  {string} lang_code: locale/language code
   */
  public download(asset, lang_code) {
    debug("Asset download called for", asset)
    return new Promise((resolve, reject) => {
    let asset_base_path: string = this.asset_config.base_dir
    let assets_path = join(asset_base_path, lang_code, 'assets')
    if (!existsSync(assets_path)) {
      sync(assets_path, '0755')
    }
      const paths = assets_path
      const pths = this.urlFromObject(asset)
      asset._internal_url = this.getAssetUrl(pths.join('/'), paths)
      pths.unshift(paths)
      const asset_path = path.join.apply(path, pths)
      request.get({ url: asset.url }).on('response', resp => {
        if (resp.statusCode === 200) {
          if (asset.download_id) {
            let attachment = resp.headers['content-disposition']
            asset['filename'] = decodeURIComponent(attachment.split('=')[1])
          }
          const _path = asset_path.replace(asset.filename, '')
          if (!existsSync(_path)) {
            mkdirp.sync(_path, '0755')
          }
          let localStream = createWriteStream(path.join(_path, asset.filename))
          resp.pipe(localStream)
          localStream.on('close', () => {
            log.info("Asset downloaded successfully", asset)
            return resolve(asset)
          })
        } else {
          log.error(msg.error.asset_download, asset);
          return reject(render(msg.error.asset_download, { filename: asset.filename }))
        }
      })
        .on('error', reject)
        .end()
    })
      .catch((error) => {
        log.error(msg.error.asset_download, asset);
        debug(msg.error.asset_download, asset)
        console.error(error, "eorrrrrr")
      })

  }
  /**
   * @description to delete the asset from the filesystem
   * @param  {object} asset: asset data
   * @param  {string} locale: language/locale code
   */
  public delete(asset, locale) {
    debug("Asset deletion called for", asset)
    try {
      return new Promise((resolve, reject) => {
        let asset_base_path: string = this.asset_config.base_dir
        let assets_path = join(asset_base_path, locale, 'assets')
        const asset_folder_path = path.join(assets_path, asset.uid)
        console.log(asset_folder_path, typeof asset_folder_path,"asset_folder_path")
        if(typeof asset_folder_path == "string"){
        if (existsSync(asset_folder_path)) {
          rimraf(asset_folder_path, error => {
            if (error) {
              debug("Error while removing", asset_folder_path, "asset file");
              return reject(error)
            }
            debug("Asset deleted successfully")
            return resolve(asset)
          })
        } else {
          debug(`${asset_folder_path} did not exist!`)
          log.info(`${asset_folder_path} did not exist!`)
          return resolve(asset)
        }
      }else{
        debug(`${asset_folder_path} did not exist!`)
        log.info(`${asset_folder_path} did not exist!`)
        return resolve(asset)
      }
      })
    }
    catch (error) {
      console.error(error)
    }
  }
/**
   * @description to unpublish the asset from the filesystem
   * @param  {object} asset: asset data
   * @param  {string} locale: language/locale code
   */

  public unpublish(asset, locale) {
    debug("asset unpublished called for", asset)
    return new Promise((resolve, reject) => {
      let asset_base_path: string = this.asset_config.base_dir
      let assets_path = join(asset_base_path, locale, 'assets')
      let asset_folder_path = path.join(assets_path, asset.uid)
      let getPath = new Promise(function (_resolve, _reject) {
        try {
          fs.readdir(asset_folder_path, function (err, files) {
            if (!err) {
              files.forEach(function (file) {
                let path = asset_folder_path + "/" + file
                return _resolve(path)
              });
            }
            else{
              log.info(`${asset_folder_path} did not exist!`)
              _resolve()
            }
          });
        }
        catch (err) {
          _reject(err)
        }
      })
      getPath.then((asset_file_path) => {
        let path = JSON.stringify(asset_file_path)
        if (existsSync(path)) {
          rimraf(path, (error) => {
            if (error) {
              log.error(`${asset_file_path} asset file not found`);
              return reject(error)
            }
            log.info(`${asset_file_path} asset unpublished`);
            return resolve(asset)
          })
        } else {
          log.error(`${asset_file_path} did not exist!`)
          return resolve(asset)
        }

      }).catch((error) => {
        log.error(`asset unpublished failed`)
        console.error(error)
      })
    })
  }

 
  /**
   * @description Generate the full assets url for the given url
   * @param  {string} assetUrl
   * @param  {string} path
   */
  private getAssetUrl(assetUrl, path) {
    var relativeUrlPrefix = path.split('/').reverse().slice(0, 2)
    var code= relativeUrlPrefix[1].split('-')[0]
    //console.log(code,"code",relativeUrlPrefix,"vrelativeUrlPrefixrelativeUrlPrefixrelativeUrlPrefix")
    if (code == "en"){
      assetUrl = join("/", relativeUrlPrefix[0], assetUrl)
    }
    else{
      assetUrl = join("/", code , relativeUrlPrefix[0], assetUrl)
    }
    
    return assetUrl
  }

  
  
  /**
   * @description Used to generate asset path from keys using asset
   * @param  {any} asset: asset data
   */
  private urlFromObject(asset: any) {
    var values: any = [],
    _keys = ['uid', 'filename']

    for (var a = 0, _a = _keys.length; a < _a; a++) {
      if (_keys[a] === 'uid') {
        values.push(asset.uid)
      } else if (asset[_keys[a]]) {
        values.push(asset[_keys[a]])
      } else {
        throw new TypeError(render(msg.error.asset_key_undefined, { key: _keys[a] }))
      }
    }
    return values
  }
}



