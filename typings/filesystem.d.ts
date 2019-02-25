/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare class FsManager {
    private assetConfig;
    constructor(assetConfig: any);
    /**
     * @description to download the acutal asset and store it in fileystem
     * @param  {object} assetData: asset data
     */
    download(assetData: any): Promise<{}>;
    /**
     * @description to delete the asset from the filesystem
     * @param  {object} asset: asset data
     */
    delete(asset: any): Promise<{}>;
    /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset: asset data
     */
    unpublish(asset: any): Promise<{}>;
    /**
     * @description Generate the full assets url for the given url
     * @param  {string} assetUrl
     * @param  {string} pth
     */
    private getAssetUrl;
    /**
     * @description Used to generate asset path from keys using asset
     * @param  {any} asset: asset data
     */
    private urlFromObject;
}
