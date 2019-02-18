"use strict";
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const fs_1 = require("fs");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const request_1 = __importDefault(require("request"));
const rimraf_1 = __importDefault(require("rimraf"));
const debug = debug_1.debug('asset-store-filesystem');
class FsManager {
    constructor(assetConfig) {
        this.assetConfig = assetConfig;
    }
    /**
     * @description to download the acutal asset and store it in fileystem
     * @param  {object} assetData: asset data
     */
    download(assetData) {
        debug('Asset download called for', assetData);
        return new Promise((resolve, reject) => {
            try {
                const assetBasePath = this.assetConfig.assetStore.baseDir;
                const assetsPath = path_1.default.join(assetBasePath, assetData.locale, 'assets');
                const asset = assetData.data;
                if (!fs_1.existsSync(assetsPath)) {
                    mkdirp_1.default.sync(assetsPath, '0755');
                }
                const paths = assetsPath;
                const pths = this.urlFromObject(asset);
                asset._internal_url = this.getAssetUrl(pths.join('/'), paths);
                pths.unshift(paths);
                const assetPath = path_1.default.join.apply(path_1.default, pths);
                if (!fs_1.existsSync(assetPath)) {
                    request_1.default.get({ url: asset.url }).on('response', (resp) => {
                        if (resp.statusCode === 200) {
                            const pth = assetPath.replace(asset.filename, '');
                            if (!fs_1.existsSync(pth)) {
                                mkdirp_1.default.sync(pth, '0755');
                            }
                            const localStream = fs_1.createWriteStream(path_1.default.join(pth, asset.filename));
                            resp.pipe(localStream);
                            localStream.on('close', () => {
                                return resolve(assetData);
                            });
                        }
                        else {
                            return reject(`${asset.uid} Asset download failed`);
                        }
                    })
                        .on('error', reject)
                        .end();
                }
                else {
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
    delete(asset) {
        debug('Asset deletion called for', asset);
        return new Promise((resolve, reject) => {
            try {
                const assetBasePath = this.assetConfig.assetStore.baseDir;
                const assetsPath = path_1.default.join(assetBasePath, asset.locale, 'assets');
                const assetFolderPath = path_1.default.join(assetsPath, asset.uid);
                if (fs_1.existsSync(assetFolderPath)) {
                    rimraf_1.default(assetFolderPath, (error) => {
                        if (error) {
                            debug('Error while removing', assetFolderPath, 'asset file');
                            return reject(error);
                        }
                        debug('Asset removed successfully');
                        return resolve(asset);
                    });
                }
                else {
                    debug(`${assetFolderPath} did not exist!`);
                    return resolve(asset);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset: asset data
     */
    unpublish(asset) {
        debug('asset unpublished called for', asset);
        return new Promise((resolve, reject) => {
            try {
                this.delete(asset).then(resolve).catch(reject);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * @description Generate the full assets url for the given url
     * @param  {string} assetUrl
     * @param  {string} pth
     */
    getAssetUrl(assetUrl, pth) {
        const relativeUrlPrefix = pth.split(path_1.default.sep).reverse().slice(0, 2);
        const code = relativeUrlPrefix[1].split('-')[0];
        const url = (code === 'en') ? path_1.default.join('/', relativeUrlPrefix[0], assetUrl) :
            path_1.default.join('/', code, relativeUrlPrefix[0], assetUrl);
        return url;
    }
    /**
     * @description Used to generate asset path from keys using asset
     * @param  {any} asset: asset data
     */
    urlFromObject(asset) {
        const values = [];
        const keys = ['uid', 'filename'];
        for (let a = 0, i = keys.length; a < i; a++) {
            if (keys[a] === 'uid') {
                values.push(asset.uid);
            }
            else if (asset[keys[a]]) {
                values.push(asset[keys[a]]);
            }
        }
        return values;
    }
}
exports.FsManager = FsManager;
