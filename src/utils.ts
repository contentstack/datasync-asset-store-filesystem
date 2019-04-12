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

export function extractDetails(type, asset, config) {
    const values: any = []
    let keys: string[]

    if (type === 'internal') {
      keys = config.internalUrlKeys
    } else {
      keys = config.folderPathKeys
    }

    if (config.assetFolderPrefixKey && typeof config.assetFolderPrefixKey === 'string') {
      values.push(config.assetFolderPrefixKey)
    }

    const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
    let matches

    while ((matches = regexp.exec(asset.url)) !== null) {
      if (matches && matches.length) {
        if (matches[2]) {
          asset.apiVersion = matches[2]
        }
        if (matches[3]) {
          asset.apiKey = matches[3]
        }
        if (matches[4]) {
          asset.downloadId = matches[4]
        }
      }
    }

    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      if (keys[i].charAt(0) === ':') {
        const k = keys[i].substring(1)
        if (asset[k]) {
          values.push(asset[k])
        } else {
          throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
        }
      } else {
        values.push(keys[i])
      }
    }

    return values
  }