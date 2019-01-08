/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { existsSync, createReadStream, createWriteStream, unlinkSync } from 'fs'
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
import { resolveSoa } from 'dns';
//import { connect } from './mongo-connection';

export class FsManager {
  private asset_config: AssetConfigInterface
  private langs: any[]

  constructor(asset_config) {
    //console.log(asset_config,"gfgfdgfadgfadgfgfdagdagfdgfadg   aset config")
    this.asset_config = asset_config
    this.langs = get('locales')

  }

  public download(asset, lang_code) {
    console.log(asset, "download")
    const lang = find(this.langs, lang => {
      return lang.code === lang_code
    })
    //console.log(lang,"langlanglanglanglanglanglanglanglanglanglanglang")
    return new Promises((resolve, reject) => {
      const paths = lang.assets_path
      //console.log("assetttttttttttttttttttttttttttttttttttttttttttttt", asset)
      const pths = this.urlFromObject(asset)
      //console.log(paths, pths, "pathsssssssssssssssssss")
      asset._internal_url = this.getAssetUrl(pths.join('/'), lang)
      pths.unshift(paths)
      const asset_path = path.join.apply(path, pths)
      //console.log("asset.url",asset.url)


      //let out = request({ url: asset.url })
      request.get({ url: asset.url }).on('response', resp => {
        //console.log("ithe aalo11")
        if (resp.statusCode === 200) {
          // console.log("ithe aalo22")
          if (asset.download_id) {
            //console.log("ithe aalo33")
            let attachment = resp.headers['content-disposition']
            asset['filename'] = decodeURIComponent(attachment.split('=')[1])
          }
          const _path = asset_path.replace(asset.filename, '')
          if (!existsSync(_path)) {
            mkdirp.sync(_path, '0755')
          }
          let localStream = createWriteStream(path.join(_path, asset.filename))
          //console.log(localStream,"localStreamlocalStreamlocalStreamlocalStreamlocalStreamlocalStream")
          resp.pipe(localStream)
          localStream.on('close', () => {
            //console.log("ithe aalo44")
            //console.log(asset,"assetassetassetassetassetasset")
            return resolve(asset)
          })
        } else {
          //console.log("ithe aalo55")
          return reject(render(msg.error.asset_download, { filename: asset.filename }))
        }
      })
        .on('error', reject)
        .end()
    })
      .catch((error) => {
        // console.log("in catch error")
        console.log(error, "eorrrrrr")
      })

  }

  public delete(asset, locale) {
    console.log(asset, "delete")
    return new Promises((resolve, reject) => {
      const asset_folder_path = path.join(getAssetPath(locale), asset.uid)
      if (existsSync(asset_folder_path)) {
        rimraf(asset_folder_path, error => {
          if (error) {
            return reject(error)
          }
          return resolve(asset)
        })
      } else {
        console.info(`${asset_folder_path} did not exist!`)
        return resolve(asset)
      }
    })
  }

  public unpublish(asset, locale) {
    console.log(asset, "unpublish")
    console.log("in unpublish asset", asset, locale, "asset and locale")
    return new Promises((resolve, reject) => {
      let asset_folder_path = path.join(getAssetPath(locale), asset.uid)
      console.log(asset_folder_path,"assetfolderpath")
      //let asset_file_path
      let promise = new Promises(function (_resolve, _reject) {
        console.log("ethe aalo")
        try {
          fs.readdir(asset_folder_path, function (err, files) {
            if (!err) {
              files.forEach(function (file) {
                console.log(file, "filesssssssssssssssssssss");
                let path = asset_folder_path + "/" + file
                console.log("ethe aalo 2")
                return _resolve(path)
              });
            }
            else{
              console.log("ethe aalo 3")
              console.info(`${asset_folder_path} did not exist!`)
              _resolve()
            }
            

          });
        }
        catch (err) {
          _reject(err)
        }
      })
      //console.log("asset_file_path", asset_file_path)
      promise.then(asset_file_path => {
        console.log("ethe aalo 4")
        if (existsSync(asset_file_path)) {
          rimraf(asset_file_path, (error) => {
            if (error) {
              console.log("in if, error while removing file")
              return reject(error)
            }
            console.log("removing file")
            return resolve(asset)
          })
        } else {
          console.info(`${asset_file_path} did not exist!`)
          return resolve(asset)
        }

      }).catch((error) => {
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
    //console.log(asset,"asset in urlformObjest method", this.asset_config, "config")
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

