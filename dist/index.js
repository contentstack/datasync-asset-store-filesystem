"use strict";
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const lodash_1 = require("lodash");
const path_1 = require("path");
const config_1 = require("./config");
const filesystem_1 = require("./filesystem");
let assetStoreConfig;
let assetStoreInstance;
exports.assetStoreInstance = assetStoreInstance;
exports.getAssetLocation = (asset, config) => {
    const values = [];
    const keys = lodash_1.compact(config.pattern.split('/'));
    if (config.assetFolderPrefixKey && typeof config.assetFolderPrefixKey === 'string') {
        values.push(config.assetFolderPrefixKey);
    }
    const regexp = new RegExp('https://(assets|images).contentstack.io/v3/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g');
    let matches;
    // tslint:disable-next-line: no-conditional-assignment
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
    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
        if (keys[i].charAt(0) === ':') {
            const k = keys[i].substring(1);
            if (asset[k]) {
                values.push(asset[k]);
            }
            else {
                throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`);
            }
        }
        else {
            values.push(keys[i]);
        }
    }
    return path_1.join.apply(this, values);
};
exports.getFileLocation = (asset, config) => {
    const values = [];
    const keys = lodash_1.compact(config.baseDir.split('/')).concat(lodash_1.compact(config.pattern.split('/')));
    if (config.assetFolderPrefixKey && typeof config.assetFolderPrefixKey === 'string') {
        values.push(config.assetFolderPrefixKey);
    }
    const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g');
    let matches;
    // tslint:disable-next-line: no-conditional-assignment
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
    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
        if (keys[i].charAt(0) === ':') {
            const k = keys[i].substring(1);
            if (asset[k]) {
                values.push(asset[k]);
            }
            else {
                throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`);
            }
        }
        else {
            values.push(keys[i]);
        }
    }
    return values;
};
exports.setConfig = (config) => {
    assetStoreConfig = config;
};
exports.getConfig = () => {
    return assetStoreConfig;
};
const debug = debug_1.debug('asset-store-filesystem');
/**
 * @description to start the asset connector
 * @param {object} config Optional app config
 * @example
 * import { start } from '@contentstack/datasync-asset-store-filesystem'
 * const assetStore = start(config)
 *  .then()
 *  .catch()
 *
 * return assetStore.download(asset)
 * return assetStore.unpublish(asset)
 *
 * @return {FSAssetStore}
 */
function start(config) {
    return new Promise((resolve, reject) => {
        try {
            assetStoreConfig = (config) ? lodash_1.merge(config_1.defaultConfig, config) : config_1.defaultConfig;
            exports.assetStoreInstance = assetStoreInstance = new filesystem_1.FSAssetStore(assetStoreConfig);
            return resolve(assetStoreInstance);
        }
        catch (error) {
            debug('Failed to load content-store due to', error);
            reject(error);
        }
    });
}
exports.start = start;
