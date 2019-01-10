/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/


const assetConnector = require('../dist')
const config = require('../dist/default')
let connector = null

let conf = {
	"hi;":"bye",
	"type":"tp"
}


describe('# download', function () {
	beforeAll(function loadConnector() {
		assetConnector.start(config)
			.then(_connector => {
				connector = _connector
			})		
	})
	
	test('# start()', function (){
		const asset = require('../dist')
		asset.start(conf)
		.then(_connector => {
			let tp = _connector
		})	
	})

	test('# dowload asset', function () {
		return connector.download({
			"uid": "002",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "Widakk.png",
			"url": "https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("title", "Widakk.png");
		})
	})

	test('# dowload non existent asset', function () {
		return connector.download({
			"uid": "002",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "Widakk.png",
			"url": "https://images.contentstack.io/v3/assets/dfgdgdgdg/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			expect(result).toBe(undefined);
			//expect(result).toHaveProperty("title", "Widakk.png");
		})
	})

	test('# unpublish asset', function () {
		return connector.unpublish({
			"uid": "002",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "Widakk.png",
			"url": "https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			//console.log(result,"result")
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("title", "Widakk.png");
		})
	})

	test('# unpublish non existent asset', function () {
		return connector.unpublish({
			"uid": "006",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "abc.png",
			"url": "https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			//console.log(result,"result")
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("title", "Widakk.png");
		})
	})


	test('# unpublish non existent asset folder', function () {
		return connector.unpublish({
			"uid": "005",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "abc.png",
			"url": "https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			console.log(result,"result")
			// expect(result).toHaveProperty("title");
			// expect(result).toHaveProperty("title", "Widakk.png");
		})
	})

	test('# delete asset', function () {
		return connector.delete({
			"uid": "002",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "Widakk.png",
			"url": "https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("title", "Widakk.png");
		})
	})

	test('# delete non existent asset', function () {
		return connector.delete({
			"uid": "002",
			"content_type": "image/png",
			"file_size": "17283",
			"tags": [4],
			"filename": "Widakk.png",
			"url": "https://images.contentstack.io/v3/assets/gfdgbgjfdjg/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg",
			"is_dir": false,
			"parent_uid": "f1",
			"_version": 1,
			"title": "Widakk.png",
			"no": 3
		}, "en-us").then(function (result) {
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("title", "Widakk.png");
		})
	})
})

