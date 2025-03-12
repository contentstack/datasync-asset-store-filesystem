const requiredKeysForPublish = ['url', 'locale', 'uid']
const requiredKeysForUnpublish = ['url', 'locale', 'filename', 'uid']

export const validatePublishAsset = (asset) => {
    requiredKeysForPublish.forEach((key) => {
      if (!(key in asset)) {
        throw new Error(`${key} is missing in asset publish!\n${JSON.stringify(asset)}`)
      }
    })
}

export const validateUnPublishAsset = (asset) => {
    requiredKeysForUnpublish.forEach((key) => {
      if (!(key in asset)) {
        throw new Error(`${key} is missing in asset unpublish!\n${JSON.stringify(asset)}`)
      }
    })
}

export const sanitizePath = (str) => str?.replace(/^(\.\.(\/|\\|$))+/, '');