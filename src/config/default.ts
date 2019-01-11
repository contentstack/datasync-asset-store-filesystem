
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"

export const defaultConfig =  {
		"asset-connector": {
    	"type": 'filesystem',
      "pattern": '/assets/:uid/:filename',
      "base_dir": './_contents'
    }
}