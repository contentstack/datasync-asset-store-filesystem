/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
declare module "assetStore"{
	
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

}