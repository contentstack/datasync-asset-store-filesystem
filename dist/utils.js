"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requiredKeysForPublish = ['url', 'locale', 'uid'];
const requiredKeysForUnpublish = ['url', 'locale', 'filename', 'uid', '_internal_url'];
exports.validatePublishAsset = (asset) => {
    requiredKeysForPublish.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!\n${JSON.stringify(asset)}`);
        }
    });
};
exports.validateUnPublishAsset = (asset) => {
    requiredKeysForUnpublish.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset unpublish!\n${JSON.stringify(asset)}`);
        }
    });
};
