
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

export const defaultConfig = {
  assetStore: {
    assetFolderPrefixKey: 'assets',
    baseDir: './_contents',
    pattern:  '/:uid/:filename',
    // optional seperator
    // seperator: '\/\/'
  },
};
