/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { createWriteStream, existsSync } from 'fs';
import { compact } from 'lodash';
import { join, resolve as resolvePath, sep } from 'path';
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
    this.config.folderPathKeys = compact(this.config.baseDir.split(sep)).concat(compact(this.config.pattern.split(sep)))
    this.config.internalUrlKeys = compact(this.config.pattern.split(sep));
  }

  /**
   * @public
   * @method download
   * @description Downloads the asset object onto local fs
   * @param  {object} input Asset object details
   * @returns {Promise} returns the asset object, if successful.
   */
  public download(asset) {
    debug('Asset download invoked ' + JSON.stringify(asset));
    return new Promise((resolve, reject) => {
      try {
        // Move utility calculations to a utility file
        // Primaries in teh file: download, unpublish, delete
        // add asset structure validations
        return request.get({ url: encodeURI(asset.url) })
          .on('response', (resp) => {
            if (resp.statusCode === 200) {
              if (asset.hasOwnProperty('download_id')) {
                const attachment = resp.headers['content-disposition'];
                asset.filename = decodeURIComponent(attachment.split('=')[1]);
              }
              
              const internalUrlKeys = this.extractDetails('internal', asset)
              // <prefix>/bltxyc123/abcd.jpg
              asset._internal_url = join.apply(this, internalUrlKeys)

              // [<prefix?>, 'uid', 'filename']
              const filePathArray = this.extractDetails('file', asset)
              // [<prefix?>, 'uid']
              const folderPathArray = Object.assign([], filePathArray)
              folderPathArray.splice(folderPathArray.length - 1)

              // <prefix>/bltxyc123
              const folderPath = resolvePath(join.apply(this, folderPathArray))
              const filePath = resolvePath(join.apply(this, filePathArray))

              // blocking!
              if (!existsSync(folderPath)) {
                mkdirp.sync(folderPath, '0755');
              }
              const localStream = createWriteStream(filePath);
              resp.pipe(localStream);
              localStream.on('close', () => {
                return resolve(asset);
              });
            } else {
              return reject(`Failed to download asset ${JSON.stringify(asset)}`);
            }
          })
          .on('error', reject)
          .end();
      } catch (error) {
        debug(`${asset.uid} asset download failed`);
        return reject(error);
      }
    });
  }

  private extractDetails(type, asset: IAsset) {
    const values: any = []
    let keys: string[]

    if (type === 'internal') {
      keys = this.config.internalUrlKeys
    } else {
      keys = this.config.folderPathKeys
    }

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
      if (keys[i].charAt(0) === ':') {
        const k = keys[i].substring(1)
        if (asset[k]) {
          values.push(asset[k])
        } else {
          throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
        }
      } else {
        values.push(keys[i])
      }
    }

    return values
  }

  /**
   * @public
   * @method delete
   * @description Delete the asset from fs db
   * @param  {object} asset Asset to be deleted
   * @returns {Promise} returns the asset object, if successful.
   */
  public delete(asset) {
    debug('Asset deletion called for', asset);

    return new Promise((resolve, reject) => {
      try {
        // add asset structure validations
        const folderPathArray = this.extractDetails('file', asset)
        folderPathArray.splice(folderPathArray.length - 1, 1)

        const folderPath = resolvePath(join.apply(this, folderPathArray))
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
   * @public
   * @method unpublish
   * @description Unpublish the asset from filesystem
   * @param  {object} asset Asset to be unpublished
   * @returns {Promise} returns the asset object, if successful.
   */
  public unpublish(asset) {
    debug(`Asset unpublish called ${JSON.stringify(asset)}`);

    return new Promise((resolve, reject) => {
      try {
        // add asset structure validations
        const filePathArray = this.extractDetails('file', asset)
        const filePath = resolvePath(join.apply(this, filePathArray))

        if (existsSync(filePath)) {
          
          return rimraf(filePath, (error) => {
            if (error) {
              debug(`Error while removing ${filePath} asset file`);

              return reject(error);
            }

            return resolve(asset);
          });
        }
        debug(`${filePath} did not exist!`);

        return resolve(asset);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
