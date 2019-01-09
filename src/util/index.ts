/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { findIndex } from 'lodash';
import { get } from '../config';
import * as Mustache from 'mustache'

export const render = Mustache.render

export function getAssetPath (langCode: string) {
  let pos = findIndex(get('locales'), {
    code: langCode
  });
  if (~pos) {
    return get('locales')[pos]['assets_path'];
  } else {
    throw new Error(`Content path not found for ${langCode} !`);
  }
};

