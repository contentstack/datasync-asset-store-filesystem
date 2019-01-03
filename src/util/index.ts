import { has, findIndex, uniq, sortBy } from 'lodash';
import { get } from '../config';
import * as Mustache from 'mustache'

export const render = Mustache.render

export function getContentPath (langCode: string) {
  let pos = findIndex(get('locales'), {
    code: langCode
  });
  if (~pos) {
    return get('locales')[pos]['contents_path'];
  } else {
    throw new Error(`Content path not found for ${langCode} !`);
  }
};

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

/**
 * Function which includes the references' content type entry
 * into the content type entry data
 *
 * @param {Object} data         - Data in which references need to be included
 * @param {String} language      - Contains the locale of the given Content Type
 * @param {Object} references    - Object, containing the references hierarchy
 * @param {String} parent_id     - UID of the parent
 * @param {Object} _this         - 'this' instance of the caller method
 * @return {Function} promise    - Function which is called upon completion
 */

export function detectCyclic (uid: string, reference_map: string[]) {
  let flag, list;
  (flag = false), (list = [uid]);

  function _getParents(child: string) {
    let parents: string[] = [];
    for (let key in reference_map) {
      if (~reference_map[key].indexOf(child)) {
        parents.push(key);
      }
    }
    return parents;
  }

  for (let i = 0; i < list.length; i++) {
    let parent = _getParents(list[i]);
    if (~parent.indexOf(uid)) {
      flag = true;
      break;
    }
    list = uniq(list.concat(parent));
  }
  return flag;
};

export function sort (collection: any, key: string, operator: number) {
  collection = sortBy(collection, key);
  if (~operator) {
    return collection;
  } else {
    let __collection: any[] = [];
    for (let i = 0, j = collection.length - 1; j >= 0; i++, j--) {
      __collection[i] = collection[j];
    }
    return __collection;
  }
};