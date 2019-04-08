/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare class FsManager {
    private config;
    constructor(config: any);
    /**
     * @public
     * @method download
     * @description Downloads the asset object onto local fs
     * @param  {object} input Asset object details
     * @returns {Promise} returns the asset object, if successful.
     */
    download(asset: any): Promise<{}>;
    private extractDetails;
    /**
     * @public
     * @method delete
     * @description Delete the asset from fs db
     * @param  {object} asset Asset to be deleted
     * @returns {Promise} returns the asset object, if successful.
     */
    delete(asset: any): Promise<{}>;
    /**
     * @public
     * @method unpublish
     * @description Unpublish the asset from filesystem
     * @param  {object} asset Asset to be unpublished
     * @returns {Promise} returns the asset object, if successful.
     */
    unpublish(asset: any): Promise<{}>;
}
