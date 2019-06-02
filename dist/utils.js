"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requiredKeysForPublish = ['url', 'locale', 'uid'];
const requiredKeysForUnpublish = ['url', 'locale', 'filename', 'uid', '_internal_url'];
exports.validatePublishAsset = (asset) => {
    requiredKeysForPublish.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!`);
        }
    });
};
exports.validateUnPublishAsset = (asset) => {
    requiredKeysForUnpublish.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!`);
        }
    });
};
