/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
declare let assetStoreInstance: any;
export declare const getAssetLocation: (asset: any, config: any) => any;
export declare const getFileLocation: (asset: any, config: any) => any;
export declare const setConfig: (config: any) => void;
export declare const getConfig: () => any;
export { assetStoreInstance };
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
export declare function start(config: any): Promise<unknown>;
