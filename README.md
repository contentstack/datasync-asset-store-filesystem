
[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

  

## Contentstack Sync Asset Store Filesystem

  

This module is basically a Filesystem database where the Sync Manager stores the most recent version of assets. When the Sync Manager syncs with the server or any other device where the content is updated, it fetches that asset and places it in the Content Store Filesystem.

  

## Prerequisite

  

You need to install Node.js version 8 or above to use the Contentstack webbook listener and register a method which gets called on webhook triggered.

  

## Working

  

[Contentstack Webhook Listener](https://github.com/contentstack/contentstack-content-store-mongodb/blob/master) or your own personalized cron job can be used to invoke the app and sync the data. C[ontentstack Sync Manager](https://github.com/contentstack/contentstack-content-store-mongodb/blob/master) is used to integrate and bind all the modules together. Any publish, unpublish, or delete action performed on assets will be tracked and synced with Filesystem accordingly.

  

## Usage

  

This is how the Filesystem Assetstore connector is defined in the boilerplate:

  

```js

const  assetConnector = require('contentstack-asset-store-filesystem')
const  config = require(./config)
let  connector

assetConnector.start(config)
.then((_connector) => {
	connector = _connector
})

```

  

## Configuration

  

Here is the config table for Contentstack Sync Filesystem Content Store:

  
|Property  |  DataType|Required|Description|Default|
|--|--|--|--|--|
|  asset-store-filesystem.baseDir|string |false|The location of the file for storing the assets|./_contents |


