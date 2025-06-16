/**
 * A simple logging interface that can be used to log messages.
 */
export interface Logger {
    log: (message: any, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
}

/**
 * A logger that logs messages to the console.
 */
export const consoleLogger: Logger = {
    log: (message: string, ...args) => {
        console.log(message, ...args);
    },
    warn: (message: string, ...args) => {
        console.warn(message, ...args);
    },
    error: (message: string, ...args) => {
        console.error(message, ...args);
    },
};

/**
 * The logger that should be used for logging messages.
 */
let logger: Logger = consoleLogger;

/**
 * Gets the logger that is currently being used for logging messages.
 * @returns The logger that is currently being used.
 */
export function getLogger(): Logger {
    return logger;
}

/**
 * Sets the logger to use for logging messages.
 * @param newLogger The new logger to use.
 */
export function setLogger(newLogger: Logger) {
    logger = newLogger;
}
