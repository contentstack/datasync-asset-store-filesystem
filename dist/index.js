"use strict";
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const lodash_1 = require("lodash");
const config_1 = require("./config");
const filesystem_1 = require("./filesystem");
let connector;
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
            config = (config) ? lodash_1.merge(config_1.defaultConfig, config) : config_1.defaultConfig;
            connector = new filesystem_1.FSAssetStore(config);
            return resolve(connector);
        }
        catch (error) {
            debug('Failed to load content-store due to', error);
            reject(error);
        }
    });
}
exports.start = start;
