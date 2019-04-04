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
const lodash_1 = require("lodash");
const path_1 = require("path");
const mkdirp_1 = __importDefault(require("mkdirp"));
const request_1 = __importDefault(require("request"));
const rimraf_1 = __importDefault(require("rimraf"));
const debug = debug_1.debug('asset-store-filesystem');
class FsManager {
    constructor(config) {
        this.config = config.assetStore;
        this.config.keys = lodash_1.compact(this.config.pattern.split('/:'));
    }
    /**
     * @description to download the acutal asset and store it in fileystem
     * @param  {object} assetData: asset data
     */
    download(input) {
        debug('Asset download invoked ' + JSON.stringify(input));
        const asset = input.data;
        return new Promise((resolve, reject) => {
            try {
                request_1.default.get({ url: encodeURI(asset.url) })
                    .on('response', (resp) => {
                    if (resp.statusCode === 200) {
                        if (asset.hasOwnProperty('download_id')) {
                            const attachment = resp.headers['content-disposition'];
                            asset.filename = decodeURIComponent(attachment.split('=')[1]);
                        }
                        // [<prefix?>, 'uid', 'filename']
                        const pathArray = this.extractFolderPaths(asset);
                        const folderPathArray = pathArray.splice(pathArray.length - 1, 1);
                        const folderPath = path_1.join.apply(folderPathArray);
                        // <prefix>/bltxyc123/abcd.jpg
                        const filePath = path_1.join.apply(this, pathArray);
                        asset._internal_url = filePath;
                        if (!fs_1.existsSync(folderPath)) {
                            mkdirp_1.default.sync(folderPath, '0755');
                        }
                        const localStream = fs_1.createWriteStream(filePath);
                        resp.pipe(localStream);
                        localStream.on('close', () => {
                            return resolve(input);
                        });
                    }
                    else {
                        return reject(`Failed to download asset ${JSON.stringify(asset)}`);
                    }
                })
                    .on('error', reject)
                    .end();
            }
            catch (error) {
                debug(`${asset.data.uid} asset download failed`);
                return reject(error);
            }
        });
    }
    extractFolderPaths(asset) {
        const values = [];
        const keys = this.config.keys;
        if (this.config.assetFolderPrefixKey && typeof this.config.assetFolderPrefixKey === 'string') {
            values.push(this.config.assetFolderPrefixKey);
        }
        const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g');
        let matches;
        while ((matches = regexp.exec(asset.url)) !== null) {
            if (matches && matches.length) {
                if (matches[2]) {
                    asset.apiVersion = matches[2];
                }
                if (matches[3]) {
                    asset.apiKey = matches[3];
                }
                if (matches[4]) {
                    asset.downloadId = matches[4];
                }
            }
        }
        debug(`extracting asset url from: ${JSON.stringify(asset)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`);
        for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
            if (asset[keys[i]]) {
                values.push(asset[keys[i]]);
            }
            else {
                throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`);
            }
        }
        return values;
    }
    /**
     * @description to delete the asset from the filesystem
     * @param  {object} asset: asset data
     */
    delete(asset) {
        debug('Asset deletion called for', asset);
        return new Promise((resolve, reject) => {
            try {
                const filePathArray = asset._internal_url.split(path_1.sep);
                filePathArray.splice(filePathArray.length - 1);
                const folderPathArray = filePathArray;
                const folderPath = path_1.join.apply(this, folderPathArray);
                if (fs_1.existsSync(folderPath)) {
                    return rimraf_1.default(folderPath, (error) => {
                        if (error) {
                            debug(`Error while removing ${folderPath} asset file`);
                            return reject(error);
                        }
                        return resolve(asset);
                    });
                }
                else {
                    debug(`${folderPath} did not exist!`);
                    return resolve(asset);
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset asset data
     */
    unpublish(asset) {
        debug(`Asset unpublish called ${JSON.stringify(asset.data)}`);
        return new Promise((resolve, reject) => {
            try {
                const filePath = asset._internal_url;
                if (fs_1.existsSync(filePath)) {
                    return rimraf_1.default(filePath, (error) => {
                        if (error) {
                            debug(`Error while removing ${filePath} asset file`);
                            return reject(error);
                        }
                        return resolve(asset);
                    });
                }
                else {
                    debug(`${filePath} did not exist!`);
                    return resolve(asset);
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.FsManager = FsManager;
