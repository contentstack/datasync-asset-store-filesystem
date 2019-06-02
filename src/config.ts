
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

export const defaultConfig = {
  assetStore: {
    // optional prefixing of asset in internal urls
    // assetFolderPrefixKey: 'dev-assets',
    baseDir: '_contents/:locale',
    pattern:  '/assets/:uid/:filename',
    // optional seperator
    // seperator: '\/\/'
  },
}
