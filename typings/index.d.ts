/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
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
export declare function start(config: any): Promise<{}>;
