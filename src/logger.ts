/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

let logger;
/**
 * @summary Creates a logger instance
 * @example
 *    const log = setLogger(instance)
 *    log.info('Hello world!')
 */
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
/**
 * @description to validate/check logger has 'info', 'warn', 'log', 'error', 'debug' 
 * @param  {any} logger: logger instance
 */
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

export { logger }



