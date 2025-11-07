/*!
 * contentstack-sync-asset-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

export declare const messages: {
  errors: {
    keyNotExist: (key: string, asset: any) => string;
    contentStoreLoadFailed: () => string;
    assetDownloadFailed: (asset: any) => string;
  };
  info: {
    assetDownloadInitiated: (asset: any) => string;
    assetDownloadFailed: (uid: string) => string;
    assetDeletionInitiated: () => string;
    assetFileRemovalError: (path: string) => string;
    folderPathNotExist: (path: string) => string;
    assetUnpublishInitiated: (asset: any) => string;
    filePathNotExist: (path: string) => string;
  };
};

