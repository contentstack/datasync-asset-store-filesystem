"use strict";
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const fs_1 = require("fs");
const mkdirp = __importStar(require("mkdirp"));
const path = __importStar(require("path"));
const request = __importStar(require("request"));
const rimraf_1 = __importDefault(require("rimraf"));
const logger_1 = require("./logger");
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
                const assetBasePath = this.assetConfig['asset-connector'].base_dir;
                const assetsPath = path.join(assetBasePath, assetData.locale, 'assets');
                const asset = assetData.data;
                if (!fs_1.existsSync(assetsPath)) {
                    mkdirp.sync(assetsPath, '0755');
                }
                const paths = assetsPath;
                const pths = this.urlFromObject(asset);
                asset._internal_url = this.getAssetUrl(pths.join('/'), paths);
                pths.unshift(paths);
                const assetPath = path.join.apply(path, pths);
                request.get({ url: asset.url }).on('response', (resp) => {
                    if (resp.statusCode === 200) {
                        const pth = assetPath.replace(asset.filename, '');
                        if (!fs_1.existsSync(pth)) {
                            mkdirp.sync(pth, '0755');
                        }
                        const localStream = fs_1.createWriteStream(path.join(pth, asset.filename));
                        resp.pipe(localStream);
                        localStream.on('close', () => {
                            logger_1.logger.info(`${asset.uid} Asset downloaded successfully`);
                            return resolve(assetData);
                        });
                    }
                    else {
                        logger_1.logger.error(`${asset.uid} Asset download failed`);
                        return reject(`${asset.uid} Asset download failed`);
                    }
                })
                    .on('error', reject)
                    .end();
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
                const assetBasePath = this.assetConfig['asset-connector'].base_dir;
                const assetsPath = path.join(assetBasePath, asset.locale, 'assets');
                const assetFolderPath = path.join(assetsPath, asset.uid);
                if (fs_1.existsSync(assetFolderPath)) {
                    rimraf_1.default(assetFolderPath, (error) => {
                        if (error) {
                            debug('Error while removing', assetFolderPath, 'asset file');
                            return reject(error);
                        }
                        debug('Asset removed successfully');
                        logger_1.logger.info(`${asset.uid} Asset removed successfully`);
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
            else {
                debug(`key is undefined`);
            }
        }
        return values;
    }
}
exports.FsManager = FsManager;
//# sourceMappingURL=filesystem.js.map