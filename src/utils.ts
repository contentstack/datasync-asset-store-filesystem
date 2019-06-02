const requiredKeysForPublish = ['url', 'locale', 'uid']
const requiredKeysForUnpublish = ['url', 'locale', 'filename', 'uid', '_internal_url']

export const validatePublishAsset = (asset) => {
    requiredKeysForPublish.forEach((key) => {
      if (!(key in asset)) {
        throw new Error(`${key} is missing in asset publish!`)
      }
    })
}

export const validateUnPublishAsset = (asset) => {
    requiredKeysForUnpublish.forEach((key) => {
      if (!(key in asset)) {
        throw new Error(`${key} is missing in asset publish!`)
      }
    })
}
