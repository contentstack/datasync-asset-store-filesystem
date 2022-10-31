"use strict";
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    assetStore: {
        // optional prefixing of asset in internal urls
        // assetFolderPrefixKey: 'dev-assets',
        baseDir: './_contents',
        pattern: '/:locale/assets/:uid/:filename',
    },
};
