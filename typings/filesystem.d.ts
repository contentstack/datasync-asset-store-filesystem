/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
interface IAsset {
    locale: string;
    url: string;
    uid: string;
    _internal_url?: string;
    apiVersion?: string;
    apiKey?: string;
    download_id?: string;
    filename?: string;
    title?: string;
}
/**
 * @class
 * @private
 * @summary Class that downloads and deletes assets from FS DB
 * @example
 * const assetStore = new FSAssetStore(config)
 * return assetStore.download(asset)
 *  .then()
 *  .catch()
 * @returns {FSAssetStore}
 */
export declare class FSAssetStore {
    private config;
    constructor(config: any);
    /**
     * @public
     * @method download
     * @description Downloads the asset object onto local fs
     * @param  {object} asset Asset object details
     * @returns {Promise} returns the asset object, if successful.
     */
    download(asset: any): Promise<unknown>;
    /**
     * @private
     * @method delete
     * @description Delete the asset from fs db
     * @param {array} assets Assets to be deleted
     * @returns {Promise} returns the asset object, if successful.
     */
    delete(assets: IAsset[]): Promise<unknown>;
    /**
     * @private
     * @method unpublish
     * @description Unpublish the asset from filesystem
     * @param  {object} asset Asset to be unpublished
     * @returns {Promise} returns the asset object, if successful.
     */
    unpublish(asset: IAsset): Promise<unknown>;
}
export {};
