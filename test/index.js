/*!
 * contentstack-sync-asset-store-filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */


const assetConnector = require('../dist')
const config = require('../dist/default')
let connector = null

let conf = {
	"base_dir": "bye",
	"type": "tp"
}

let asset_data = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'fr-fr',
	uid: 'blt9c4ef3c49f7b18e9',
	data: {
		uid: 'blt9c4ef3c49f7b18e9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'new_blog2.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog2.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}


let asset_data2 = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'en-us',
	uid: 'blt9c4ef3c49f7b18h9',
	data: {
		uid: 'blt9c4ef3c49f7b18h9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'blog1.jpg',
		url: 'https://images.contentstack.io/v3/assets/dfgdgdgdg/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg"',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog1.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}

let asset_data3 = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'mr-in',
	uid: 'blt9c4ef3c49f7b18f9',
	data: {
		uid: 'blt9c4ef3c49f7b18f9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'blog3.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog3.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}

// const winston = require('winston')
// const CustomLogger = winston.createLogger({
// 	level: 'info',
// 	format: winston.format.json(),
// 	defaultMeta: {service: 'user-service'},
// 	transports: [
// 		//
// 		// - Write to all logs with level `info` and below to `combined.log`
// 		// - Write all logs error (and below) to `error.log`.
// 		//
// 		new winston.transports.File({ filename: 'error.log', level: 'error' }),
// 		new winston.transports.File({ filename: 'combined.log' })
// 	]
// });
let logger = console
describe('# asset test', function () {

	beforeEach(function loadConnector() {
		assetConnector.start(config, logger)
			.then(_connector => {
				connector = _connector
			})
	})

	test('# start()', function () {
		const asset = require('../dist')
		asset.start(conf)
			.then(_connector => {
				let tp = _connector
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
			expect(error).toBe(asset_data2)
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