/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

import { debug as Debug } from 'debug';
import { createWriteStream, existsSync } from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import request from 'request';
import rimraf from 'rimraf';

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
        const assetBasePath: string = this.assetConfig.assetStore.baseDir;
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
        if (!existsSync(assetPath)) {
        request.get({ url: asset.url }).on('response', (resp) => {
          if (resp.statusCode === 200) {
            const pth = assetPath.replace(asset.filename, '');
            if (!existsSync(pth)) {
              mkdirp.sync(pth, '0755');
            }
            const localStream = createWriteStream(path.join(pth, asset.filename));
            resp.pipe(localStream);
            localStream.on('close', () => {
              return resolve(assetData);
            });
          } else {
            return reject(`${asset.uid} Asset download failed`);
          }
        })
          .on('error', reject)
          .end();
        } else {
          debug(`Skipping asset download since it is already downloaded and it's present path is ${assetPath} `);
          return resolve(assetData);
        }
      }
      catch (error) {
        debug(`${assetData.data.uid} Asset download failed`);
        reject(error);
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
        const assetBasePath: string = this.assetConfig.assetStore.baseDir;
        const assetsPath = path.join(assetBasePath, asset.locale, 'assets');
        const assetFolderPath = path.join(assetsPath, asset.uid);
        if (existsSync(assetFolderPath)) {
          rimraf(assetFolderPath, (error) => {
            if (error) {
              debug('Error while removing', assetFolderPath, 'asset file');
              return reject(error);
            }
            debug('Asset removed successfully');
            return resolve(asset);
          });
        } else {
          debug(`${assetFolderPath} did not exist!`);
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
     // try {
        this.delete(asset).then(resolve).catch(reject);
      // } catch (error) {
      //   reject(error);
      // }
    });
  }

  /**
   * @description Generate the full assets url for the given url
   * @param  {string} assetUrl
   * @param  {string} pth
   */
  private getAssetUrl(assetUrl, pth) {
    const relativeUrlPrefix = pth.split(path.sep).reverse().slice(0, 2);
    const code = relativeUrlPrefix[1].split('-')[0];
    const url = (code === 'en') ? path.join('/', relativeUrlPrefix[0], assetUrl) :
      path.join('/', code, relativeUrlPrefix[0], assetUrl);
    return url;
  }

  /**
   * @description Used to generate asset path from keys using asset
   * @param  {any} asset: asset data
   */
  private urlFromObject(asset: any) {
    const values: any = [];
    const keys = ['uid', 'filename'];

    for (let a = 0, i = keys.length; a < i; a++) {
      if (keys[a] === 'uid') {
        values.push(asset.uid);
      } else if (asset[keys[a]]) {
        values.push(asset[keys[a]]);
      }
    }
    return values;
  }
}
