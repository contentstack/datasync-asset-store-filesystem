/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
export const messages = {
	success: {
		publish: `{{type}} published successfully!`,
		unpublish: `{{type}} unpublished successfully!`,
		delete: `{{type}} deleted successfully!`
	},
	error: {
		unpublish: `Error while unpublishing {{type}}\n{{error}}`,
		publish: `Error while publishing {{type}}\n{{error}}`,
		delete: `Error while deleting {{type}}\n{{error}}`,
		find: `Error while finding {{type}}\n{{error}}`,
		fetch: `Error while fetching {{type}}\n{{error}}`,
		invalid_publish_keys: `Kindly provide valid parameters for publish`,
		invalid_unpublish_keys: `Kindly provide valid parameters for unpublish`,
		invalid_delete_keys: `Kindly provide valid parameters for delete\n`,
		invalid_find_keys: `Kindly provide valid parameters for find\n`,
		invalid_fetch_keys: `Kindly provide valid parameters for fetch\n`,
		invalid_count_keys: `Kindly provide valid parameters for count\n`,
		pth_not_exists: `{{type}} {{path}} did not exist!`,
		asset_manager_failed: `Asset manager - {{type}} failed to load`,
		content_manager_failed: `Content manager - {{type}} failed to load`,
		asset_key_undefined: `{{key}} is undefined in asset object`,
		asset_download: `Asset: {{filename}} failed to download`,
		folder_find: `Error while finding folder {{uid}} assets`,
		folder_delete: `Error while deleting folder {{uid}} assets`
	}
}