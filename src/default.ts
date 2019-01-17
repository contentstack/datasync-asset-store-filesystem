
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

export const defaultConfig = {
  'asset-connector': {
    base_dir: './_contents',
    pattern: '/assets/:uid/:filename',
    type: 'filesystem',

  },
};
