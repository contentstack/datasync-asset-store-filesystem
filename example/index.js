/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

const assetConnector = require('../dist')
const config = require('./mock/config')

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
    filename: 'Teilchenmodell_Flüssigkeit.png',
    url:
     'https://images.contentstack.io/v3/assets/***REMOVED***/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
    ACL: {},
    is_dir: false,
    _version: 1,
    title: 'blog2.jpg',
    force_load: false,
	content_type_uid: '_assets' }
}

let asset_data2= {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'en-us',
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
		filename: 'blog1.jpg',
		url:
		 'https://images.contentstack.io/v3/assets/***REMOVED***/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog1.jpg',
		force_load: false,
		content_type_uid: '_assets' }
}

let asset_data3= {
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
		url:
		 'https://images.contentstack.io/v3/assets/***REMOVED***/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog3.jpg',
		force_load: false,
		content_type_uid: '_assets' }
}

assetConnector.start(config)
.then( (connector) => {
	console.log("app started sucessfully!!")
	setTimeout(()=>{connector.download(asset_data)}, 500)
	setTimeout(()=>{connector.download(asset_data2)}, 500)
	setTimeout(()=>{connector.download(asset_data3)}, 500)
	setTimeout(()=>{connector.delete(asset_data3)}, 3000)
	setTimeout(()=>{connector.unpublish(asset_data2)}, 4000)
	
})
.catch((error) =>{
	console.error(error)
})