
/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"

export const defaultConfig =  {
	"locales": [
	  {
		"code": "en-us",
		"relative_url_prefix": "/"
	  },
	  {
		"code": "es-es",
		"relative_url_prefix": "/es/"
	  },
	  {
		"code": "fr-fr",
		"relative_url_prefix": "/fr/"
	  }
	],

		"asset-connector": {
    	"type": 'filesystem',
      "pattern": '/assets/:uid/:filename',
      "base_dir": './_contents',
      "options": {
        "dotfiles": 'ignore',
        "etag": true,
        "extensions": [ 'html', 'htm'],
        "fallthrough": true,
        "index": 'index.html',
        "lastModified": true,
        "maxAge": 0,
        "redirect": true,
        "setHeaders": (res, path, stat) => {
          res.set('x-timestamp', Date.now());
        }
      }
    }
	//}
	,
	"contentstack": {
	  "api_key": '***REMOVED***',
	  "access_token": '***REMOVED***'
	}
  }