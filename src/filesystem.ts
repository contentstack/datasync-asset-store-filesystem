/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { existsSync, createWriteStream } from 'fs'
import * as path from 'path'
import { Promise as Promises } from 'bluebird'
import * as request from 'request'
import { find } from 'lodash'
import * as mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { get } from './config'
import { getAssetPath, render } from './util'
import { AssetConfigInterface } from './util/interfaces'
import { messages as msg } from './util/messages'
import fs from 'fs';
import LoggerBuilder from "./logger";
import { debug as Debug } from "debug";

let log
const debug = Debug("asset-sotre-filesystem");

export class FsManager {
  private asset_config: AssetConfigInterface
  private langs: any[]

  constructor(asset_config) {
    this.asset_config = asset_config
    this.langs = get('locales')
    log = new LoggerBuilder().Logger
  }

  public download(asset, lang_code) {
    debug("Asset download called for", asset)
    const lang = find(this.langs, lang => {
      return lang.code === lang_code
    })
    return new Promises((resolve, reject) => {
      const paths = lang.assets_path
      const pths = this.urlFromObject(asset)
      asset._internal_url = this.getAssetUrl(pths.join('/'), lang)
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

  public delete(asset, locale) {
    debug("Asset deletion called for", asset)
    return new Promises((resolve, reject) => {
      const asset_folder_path = path.join(getAssetPath(locale), asset.uid)
      if (existsSync(asset_folder_path)) {
        rimraf(asset_folder_path, error => {
          if (error) {
            debug("Error while removing",asset_folder_path, "asset file" );
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
    })
  }

  public unpublish(asset, locale) {
    debug("asset unpublished called for", asset)
    return new Promises((resolve, reject) => {
      let asset_folder_path = path.join(getAssetPath(locale), asset.uid)
      let promise = new Promises(function (_resolve, _reject) {
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
      promise.then(asset_file_path => {
        if (existsSync(asset_file_path)) {
          rimraf(asset_file_path, (error) => {
            if (error) {
              log.error(`${asset_file_path} asset file not found`);
              return reject(error)
            }
            log.info(`${asset_file_path} asset deleted`);
            return resolve(asset)
          })
        } else {
          log.error(`${asset_file_path} did not exist!`)
          return resolve(asset)
        }

      }).catch((error) => {
        log.error(`asset deletion failed`)
        console.error(error)
      })
    })
  }

  // Generate the full assets url foro the given url
  private getAssetUrl(assetUrl, lang) {
    var relativeUrlPrefix = this.asset_config.relative_url_prefix
    assetUrl = relativeUrlPrefix + assetUrl
    if (!(lang.relative_url_prefix === '/' || lang.host)) {
      assetUrl = lang.relative_url_prefix.slice(0, -1) + assetUrl
    }
    return assetUrl
  }

  // Used to generate asset path from keys using asset
  private urlFromObject(asset: any) {
    var values: any = [],
      _keys = this.asset_config.keys

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

