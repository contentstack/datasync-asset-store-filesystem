/*!
 * contentstack-sync-asset-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

/**
 * Centralized error and log messages for the asset store filesystem
 */
export const messages = {
  // Error messages
  errors: {
    keyNotExist: (key: string, asset: any) => 
      `The key '${key}' does not exist on: ${JSON.stringify(asset)}`,
    contentStoreLoadFailed: () => 
      'Failed to load content store:',
  },
  
  // Info/Debug messages
  info: {
    assetDownloadInitiated: (asset: any) => 
      `Asset download initiated for: ${JSON.stringify(asset)}`,
    assetDownloadFailed: (uid: string) => 
      `Download failed for asset: ${uid}`,
    assetDeletionInitiated: () => 
      'Asset deletion initiated:',
    assetFileRemovalError: (path: string) => 
      `An error occurred while removing the asset file at: ${path}`,
    folderPathNotExist: (path: string) => 
      `Folder path does not exist: ${path}`,
    assetUnpublishInitiated: (asset: any) => 
      `Asset unpublish initiated for: ${JSON.stringify(asset)}`,
    filePathNotExist: (path: string) => 
      `File path does not exist: ${path}`,
  },
}

