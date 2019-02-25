/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
declare let logger: any;
/**
 * It will register a logger this it to be used accross the module other wise
 * console log will be used.
 * @param {object} customLogger instance of a logger to be register
 */
declare function setLogger(customLogger: any): void;
export { logger, setLogger };
