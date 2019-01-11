/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"

/**
 * @summary Creates a logger instance
 * @example
 *    const log = createLogger(instance)
 *    log.info('Hello world!')
 */

let logger;

export const setLogger = (customLogger?) => {
    if (logger) {
        return logger
    } else if (!validateLogger(customLogger) && !customLogger) {
        logger = console
        logger.info('Standard logger created')
    } else {
        logger = customLogger
        logger.info('Customized logger registered successfully!')
    }
    return logger
}

function validateLogger(logger) {
    if (!logger) {
        console.log("found log undefined")
        return false;
    }
    let functionExists = ['info', 'warn', 'log', 'error', 'debug'];
    functionExists.forEach(functionName => {
        if (typeof logger[functionName] !== "function") {
            console.warn("Failed to initialize custom logger due to missing function '" + functionName + "'.")
            return false;
        }
    });
    return true;
}

export {logger}



