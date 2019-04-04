/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
export declare class FsManager {
    private config;
    constructor(config: any);
    /**
     * @description to download the acutal asset and store it in fileystem
     * @param  {object} assetData: asset data
     */
    download(input: any): Promise<{}>;
    private extractFolderPaths;
    /**
     * @description to delete the asset from the filesystem
     * @param  {object} asset: asset data
     */
    delete(asset: any): Promise<{}>;
    /**
     * @description to unpublish the asset from the filesystem
     * @param  {object} asset asset data
     */
    unpublish(asset: any): Promise<{}>;
}
