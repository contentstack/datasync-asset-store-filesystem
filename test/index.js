/*!
 * contentstack-sync-asset-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */


const assetConnector = require('../dist')
const config = require('../dist/config')
const filesystem = require('fs')
let connector = null

let conf = {
	"base_dir": "bye",
	"type": "tp"
}

let asset_data = 
 { uid: 'blt9c4ef3c49f7b18e9',
   created_at: '2018-05-31T13:34:43.674Z',
   updated_at: '2018-05-31T13:34:43.674Z',
   created_by: 'blt607b206b64807684',
   updated_by: 'blt607b206b64807684',
   content_type: 'image/jpeg',
   file_size: '6524',
   tags: [],
   filename: 'kareena.jpeg',
   url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/bltdada9d78d80177c3/5b0ff9f3dc1dd5cd0f3cad5d/kareena.jpeg',
   is_dir: false,
   _version: 1,
   title: 'kareena.jpeg',
   _internal_url:'fr-fr/assets/blt9c4ef3c49f7b18e9/kareena.jpeg',
   publish_details: 
	{ environment: 'blt7b98b4cea4baeebf',
	  locale: 'fr-fr',
	  time: '2018-12-27T06:56:38.608Z',
	  user: 'blt607b206b64807684' },
   locale: 'fr-fr' } 

let asset_data2 = 
 { uid: 'blt9c4ef3c49f7b18h9',
   created_at: '2018-05-31T13:34:43.674Z',
   updated_at: '2018-05-31T13:34:43.674Z',
   created_by: 'blt607b206b64807684',
   updated_by: 'blt607b206b64807684',
   content_type: 'image/jpeg',
   file_size: '6524',
   tags: [],
   filename: 'kareena.jpeg',
   url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/bltdada9d78d80177c3/5b0ff9f3dc1dd5cd0f3cad5d/kareena.jpeg',
   is_dir: false,
   _version: 1,
   title: 'kareena.jpeg',
   _internal_url:'en-us/assets/blt9c4ef3c49f7b18h9/kareena.jpeg',
   publish_details: 
	{ environment: 'blt7b98b4cea4baeebf',
	  locale: 'en-us',
	  time: '2018-12-27T06:56:38.608Z',
	  user: 'blt607b206b64807684' },
   locale: 'en-us' }

let asset_data3 = 
 { uid: 'blt9c4ef3c49f7b18f9',
   created_at: '2018-05-31T13:34:43.674Z',
   updated_at: '2018-05-31T13:34:43.674Z',
   created_by: 'blt607b206b64807684',
   updated_by: 'blt607b206b64807684',
   content_type: 'image/jpeg',
   file_size: '6524',
   tags: [],
   filename: 'kareena.jpeg',
   url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/bltdada9d78d80177c3/5b0ff9f3dc1dd5cd0f3cad5d/kareena.jpeg',
   is_dir: false,
   _version: 1,
   title: 'kareena.jpeg',
   _internal_url:'mr-in/assets/blt9c4ef3c49f7b18f9/kareena.jpeg',
   publish_details: 
	{ environment: 'blt7b98b4cea4baeebf',
	  locale: 'mr-in',
	  time: '2018-12-27T06:56:38.608Z',
	  user: 'blt607b206b64807684' },
   locale: 'mr-in' }

describe('# asset test', function () {

	beforeEach(function loadConnector() {
		assetConnector.start(config)
			.then(_connector => {
				connector = _connector
			})
			setTimeout(()=>{

			}, 1000)
	})

	test('# test start and getConnectorInstance methods', function () {
		const asset = require('../dist')
		
		asset.start(conf)
			.then(_connector => {})
		let instance= asset.getConnectorInstance()
		return instance.download(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18e9");
		})
	})

	test('# test start and getConnectorInstance methods', function () {
		const asset = require('../dist')
		
		asset.start()
			.then(_connector => {}).catch((error)=>{
				expect(error).toBe(error)
			})
		
	})
	
	

	test('# download asset', function () {
		return connector.download(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18e9");
		})
	})


	test('# download non existent asset', function () {
		return connector.download(asset_data2).then(function () {
		}).catch(error =>{
			expect(error).toBe('blt9c4ef3c49f7b18h9 Asset download failed')
		})
	})

	test('# unpublish asset', function () {
		return connector.unpublish(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18f9");
		})
	})

	test('# unpublish non existent asset', function () {
		return connector.unpublish(asset_data3).then(function (result) {
		}).catch(error =>{
			expect(error).toBe(asset_data3)
		})
	})
	test('# download asset', function () {
		return connector.download(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18f9");
		})
	})
	
	test('# delete asset', function () {
		filesystem.chmodSync('./_contents/mr-in/assets/blt9c4ef3c49f7b18f9', '000')
		return connector.delete(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18f9");
		}).catch((error)=>{
			expect(error).toBe(error)
		})
	})
	test('# delete asset', function () {
		filesystem.chmodSync('./_contents/mr-in/assets/blt9c4ef3c49f7b18f9', '755')
		return connector.delete(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18f9");
		})
	})


	

	test('# delete non existent asset', function () {
		return connector.delete(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "blt9c4ef3c49f7b18f9");
		})
	})
})