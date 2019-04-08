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
const utils_1 = require("./utils");
const debug = debug_1.debug('asset-store-filesystem');
class FsManager {
    constructor(config) {
        this.config = config.assetStore;
        this.config.folderPathKeys = lodash_1.compact(this.config.baseDir.split(path_1.sep)).concat(lodash_1.compact(this.config.pattern.split(path_1.sep)));
        this.config.internalUrlKeys = lodash_1.compact(this.config.pattern.split(path_1.sep));
    }
    /**
     * @public
     * @method download
     * @description Downloads the asset object onto local fs
     * @param  {object} asset Asset object details
     * @returns {Promise} returns the asset object, if successful.
     */
    download(asset) {
        debug('Asset download invoked ' + JSON.stringify(asset));
        return new Promise((resolve, reject) => {
            try {
                utils_1.validatePublishAsset(asset);
                return request_1.default.get({ url: encodeURI(asset.url) })
                    .on('response', (resp) => {
                    if (resp.statusCode === 200) {
                        if (asset.hasOwnProperty('download_id')) {
                            const attachment = resp.headers['content-disposition'];
                            asset.filename = decodeURIComponent(attachment.split('=')[1]);
                        }
                        const internalUrlKeys = utils_1.extractDetails('internal', asset, this.config);
                        asset._internal_url = path_1.join.apply(this, internalUrlKeys);
                        const filePathArray = utils_1.extractDetails('file', asset, this.config);
                        const folderPathArray = Object.assign([], filePathArray);
                        folderPathArray.splice(folderPathArray.length - 1);
                        const folderPath = path_1.resolve(path_1.join.apply(this, folderPathArray));
                        const filePath = path_1.resolve(path_1.join.apply(this, filePathArray));
                        if (!fs_1.existsSync(folderPath)) {
                            mkdirp_1.default.sync(folderPath, '0755');
                        }
                        const localStream = fs_1.createWriteStream(filePath);
                        resp.pipe(localStream);
                        localStream.on('close', () => {
                            return resolve(asset);
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
                debug(`${asset.uid} asset download failed`);
                return reject(error);
            }
        });
    }
    /**
     * @public
     * @method delete
     * @description Delete the asset from fs db
     * @param  {object} asset Asset to be deleted
     * @returns {Promise} returns the asset object, if successful.
     */
    delete(asset) {
        debug('Asset deletion called for', asset);
        return new Promise((resolve, reject) => {
            try {
                utils_1.validateUnPublishAsset(asset);
                const folderPathArray = utils_1.extractDetails('file', asset, this.config);
                folderPathArray.splice(folderPathArray.length - 1, 1);
                const folderPath = path_1.resolve(path_1.join.apply(this, folderPathArray));
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
     * @public
     * @method unpublish
     * @description Unpublish the asset from filesystem
     * @param  {object} asset Asset to be unpublished
     * @returns {Promise} returns the asset object, if successful.
     */
    unpublish(asset) {
        debug(`Asset unpublish called ${JSON.stringify(asset)}`);
        return new Promise((resolve, reject) => {
            try {
                utils_1.validateUnPublishAsset(asset);
                const filePathArray = utils_1.extractDetails('file', asset, this.config);
                const filePath = path_1.resolve(path_1.join.apply(this, filePathArray));
                if (fs_1.existsSync(filePath)) {
                    return rimraf_1.default(filePath, (error) => {
                        if (error) {
                            debug(`Error while removing ${filePath} asset file`);
                            return reject(error);
                        }
                        return resolve(asset);
                    });
                }
                debug(`${filePath} did not exist!`);
                return resolve(asset);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.FsManager = FsManager;
