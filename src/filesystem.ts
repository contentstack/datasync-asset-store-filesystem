/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { createWriteStream, existsSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as request from 'request';
import rimraf from 'rimraf';
import { logger as log } from './logger';

const debug = Debug('asset-store-filesystem');

export class FsManager {
  private assetConfig;

  constructor(assetConfig) {
    this.assetConfig = assetConfig;
  }
  /**
   * @description to download the acutal asset and store it in fileystem
   * @param  {object} assetData: asset data
   */
  public download(assetData) {
    debug('Asset download called for', assetData);
    return new Promise((resolve, reject) => {
      try {
        const assetBasePath: string = this.assetConfig['asset-connector'].base_dir;
        const assetsPath = path.join(assetBasePath, assetData.locale, 'assets');
        const asset = assetData.data;
        if (!existsSync(assetsPath)) {
          mkdirp.sync(assetsPath, '0755');
        }
        const paths = assetsPath;
        const pths = this.urlFromObject(asset);
        asset._internal_url = this.getAssetUrl(pths.join('/'), paths);
        pths.unshift(paths);
        const assetPath = path.join.apply(path, pths);
        request.get({ url: asset.url }).on('response', (resp) => {
          if (resp.statusCode === 200) {
            if (asset.download_id) {
              const attachment = resp.headers['content-disposition'];
              asset.filename = decodeURIComponent(attachment.split('=')[1]);
            }
            const _path = assetPath.replace(asset.filename, '');
            if (!existsSync(_path)) {
              mkdirp.sync(_path, '0755');
            }
            const localStream = createWriteStream(path.join(_path, asset.filename));
            resp.pipe(localStream);
            localStream.on('close', () => {
              log.info(`${asset.uid} Asset downloaded successfully`);
              return resolve(asset);
            });
          } else {
            log.error(`${asset.uid} Asset download failed`);
            return reject(assetData);
          }
        })
          .on('error', reject)
          .end();
      }
      catch (error) {
        log.error(`${assetData.data.uid} Asset download failed`);
        debug(`${assetData.data.uid} Asset download failed`);
        reject(assetData);
      }
    });
  }
  /**
   * @description to delete the asset from the filesystem
   * @param  {object} asset: asset data
   */
  public delete(asset) {
    debug('Asset deletion called for', asset);

    return new Promise((resolve, reject) => {
      try {
        const assetBasePath: string = this.assetConfig['asset-connector'].base_dir;
        const assetsPath = path.join(assetBasePath, asset.locale, 'assets');
        const assetFolderPath = path.join(assetsPath, asset.uid);
        if (existsSync(assetFolderPath)) {
          rimraf(assetFolderPath, (error) => {
            if (error) {
              debug('Error while removing', assetFolderPath, 'asset file');
              return reject(error);
            }
            debug('Asset deleted successfully');
            log.info(`${asset.uid} Asset deleted successfully`);
            return resolve(asset);
          });
        } else {
          debug(`${assetFolderPath} did not exist!`);
          log.info(`${assetFolderPath} did not exist!`);
          return resolve(asset);
        }
      } catch (error) {
        reject(error);
      }
    });

  }
  /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset: asset data
     */

  public unpublish(asset) {
    debug('asset unpublished called for', asset);
    return new Promise((resolve, reject) => {
      try {
        this.delete(asset).then(resolve).catch(reject);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * @description Generate the full assets url for the given url
   * @param  {string} assetUrl
   * @param  {string} pth
   */
  private getAssetUrl(assetUrl, pth) {
    const relativeUrlPrefix = pth.split('/').reverse().slice(0, 2);
    const code = relativeUrlPrefix[1].split('-')[0];
    if (code == 'en') {
      assetUrl = path.join('/', relativeUrlPrefix[0], assetUrl);
    }
    else {
      assetUrl = path.join('/', code, relativeUrlPrefix[0], assetUrl);
    }

    return assetUrl;
  }

  /**
   * @description Used to generate asset path from keys using asset
   * @param  {any} asset: asset data
   */
  private urlFromObject(asset: any) {
    const values: any = [],
      _keys = ['uid', 'filename'];

    for (let a = 0, _a = _keys.length; a < _a; a++) {
      if (_keys[a] === 'uid') {
        values.push(asset.uid);
      } else if (asset[_keys[a]]) {
        values.push(asset[_keys[a]]);
      } else {
        debug(`key is undefined`);
      }
    }
    return values;
  }
}
