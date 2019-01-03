export interface AssetConfigInterface {
	type: string
	pattern: string
	path?: string
	relative_url_prefix: string
	keys: string[]
}

export interface RequiredParams {
  content_type_uid: string
}

export interface FindParams extends RequiredParams {
  count_only?: boolean
  remove?: boolean
  include_count?: boolean
  include_reference?: boolean
  reference_depth?: { current_depth: number, defined_depth: number}
  query?: any,
  locale: string
}

export interface OptionalParams {
	sort?: any
	references?: any
	parent_id?: string
}

export interface CountParams extends RequiredParams {
  query?: any
  count_only: boolean
}

export interface ContentTypeInterface {
	title: string
	uid: string
	schema: any[]
	options: {
    is_page: boolean,
    singleton: boolean
    title: string,
    sub_title?: any[],
    url_pattern?: string,
    url_prefix?: string
	},
	references: any
}

export interface PublishParams extends RequiredParams {
	data: any
	content_type?: ContentTypeInterface,
	locale: string
}

export interface UnpublishParams extends RequiredParams {
	data: any | any[]
	po_key?: string
	locale: string
}

export interface DeleteParams extends RequiredParams {
	data: any | any[]
	po_key?: string
	locale: string
}

export interface DeleteContentType extends RequiredParams {
	po_key: any
	data: any
}

export interface DeleteAssetFolder extends RequiredParams {
	po_key: any,
	data: any
}

export interface AssetStructure {
	uid: string
	filename: string
	filesize?: string
	url: string
	is_dir: boolean
	_version?: number
	title?: string
	created_at?: string
	updated_at?: string
	created_by?: string
	updated_by?: string
	content_type?: string
	tags?: string[]
	download_id?: string
	isEmbedded?: boolean
	count?: number
	po_key?: string
}

export interface FindAssetResult {
	assets: AssetStructure[]
	count?: number
}

export interface FetchAssetResult {
	asset: AssetStructure | any
}

export interface ReferenceDepth {
	current_depth: number,
	defined_depth: number
}

export interface ListenerInterface {
	type: string
}

export interface ConfigInterface {
	locales: {
		code: string
		relative_url_prefix?: string
		contents_path: string
		assets_path: string
	}[]
	//connector: {
		"content-connector": {
			type: string
			base_dir: string
			options?: any
		}
		"asset-connector": {
			type: string
			base_dir: string
			pattern: string
			options: any
		}
	//}
	environment: string
	path: {
		base: string
		plugins: string
	}
}

export interface UserConfigInterface {
	[prop: string]: any
	locales?: {
		code: string
		relative_url_prefix?: string
		contents_path?: string
		assets_path?: string
	}[]
	//connector?: {
		"content-connector"?: {
			type?: string
			base_dir?: string
			options?: any
		}
		"asset-connector"?: {
			type?: string
			base_dir?: string
			pattern: string
		}
	//}[]
	environment?: string
	path?: {
		base?: string
		plugins?: string
	}
}

export interface DefaultConfigInterface {
	locales: {
		code: string
	}[]

	connector: {
		contents: {
			type: string
			base_dir: string
			options?: any
		}
		assets: {
			type: string
			relative_url_prefix: string
			base_dir: string
			pattern: string
			options: any
		}
	}
	environment: string
}