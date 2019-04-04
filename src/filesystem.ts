/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { createWriteStream, existsSync } from 'fs';
import { compact } from 'lodash';
import { join, sep } from 'path';
import mkdirp from 'mkdirp';
import request from 'request';
import rimraf from 'rimraf';

const debug = Debug('asset-store-filesystem');

interface IAsset {
  url: string,
  uid: string,
  _internal_url: string,
  apiVersion?: string,
  apiKey?: string,
  downloadId?: string,
  filename?: string,
  title?: string,
  download_id?: string,
  locale?: string
}

export class FsManager {
  private config: any;

  constructor(config) {
    this.config = config.assetStore;
    this.config.keys = compact(this.config.pattern.split('/:'));
  }

  /**
   * @description to download the acutal asset and store it in fileystem
   * @param  {object} assetData: asset data
   */
  public download(input) {
    debug('Asset download invoked ' + JSON.stringify(input));
    const asset = input.data
    return new Promise((resolve, reject) => {
      try {
        request.get({ url: encodeURI(asset.url) })
          .on('response', (resp) => {
            if (resp.statusCode === 200) {
              if (asset.hasOwnProperty('download_id')) {
                const attachment = resp.headers['content-disposition'];
                asset.filename = decodeURIComponent(attachment.split('=')[1]);
              }

              // [<prefix?>, 'uid', 'filename']
              const pathArray = this.extractFolderPaths(asset)
              const folderPathArray = pathArray.splice(pathArray.length - 1, 1)
              const folderPath = join.apply(folderPathArray)
              // <prefix>/bltxyc123/abcd.jpg
              const filePath = join.apply(this, pathArray)
              asset._internal_url = filePath

              if (!existsSync(folderPath)) {
                mkdirp.sync(folderPath, '0755');
              }
              const localStream = createWriteStream(filePath);
              resp.pipe(localStream);
              localStream.on('close', () => {
                return resolve(input);
              });
            } else {
              return reject(`Failed to download asset ${JSON.stringify(asset)}`);
            }
          })
          .on('error', reject)
          .end();
      } catch (error) {
        debug(`${asset.data.uid} asset download failed`);
        return reject(error);
      }
    });
  }

  private extractFolderPaths(asset: IAsset) {
    const values: any = []
    const keys = this.config.keys

    if (this.config.assetFolderPrefixKey && typeof this.config.assetFolderPrefixKey === 'string') {
      values.push(this.config.assetFolderPrefixKey)
    }

    const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
    let matches

    while ((matches = regexp.exec(asset.url)) !== null) {
      if (matches && matches.length) {
        if (matches[2]) {
          asset.apiVersion = matches[2]
        }
        if (matches[3]) {
          asset.apiKey = matches[3]
        }
        if (matches[4]) {
          asset.downloadId = matches[4]
        }
      }
    }
    debug(`extracting asset url from: ${JSON.stringify(asset)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`)

    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      if (asset[keys[i]]) {
        values.push(asset[keys[i]])
      } else {
        throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
      }
    }

    return values
  }

  /**
   * @description to delete the asset from the filesystem
   * @param  {object} asset: asset data
   */
  public delete(asset) {
    debug('Asset deletion called for', asset);

    return new Promise((resolve, reject) => {
      try {
        const filePathArray = asset._internal_url.split(sep)
        filePathArray.splice(filePathArray.length - 1)
        const folderPathArray = filePathArray
        const folderPath = join.apply(this, folderPathArray)
        if (existsSync(folderPath)) {

          return rimraf(folderPath, (error) => {
            if (error) {
              debug(`Error while removing ${folderPath} asset file`);

              return reject(error);
            }

            return resolve(asset);
          });
        } else {
          debug(`${folderPath} did not exist!`);

          return resolve(asset);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * @description to unpublish the asset from the filesystem
   * @param  {object} asset asset data
   */
  public unpublish(asset) {
    debug(`Asset unpublish called ${JSON.stringify(asset.data)}`);

    return new Promise((resolve, reject) => {
      try {
        const filePath = asset._internal_url

        if (existsSync(filePath)) {
          
          return rimraf(filePath, (error) => {
            if (error) {
              debug(`Error while removing ${filePath} asset file`);

              return reject(error);
            }

            return resolve(asset);
          });
        } else {
          debug(`${filePath} did not exist!`);

          return resolve(asset);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
}
