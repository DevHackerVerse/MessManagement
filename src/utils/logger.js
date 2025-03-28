// utils/logger.js
class Logger {
    static log(message, data = null) {
        console.log(`[LOG] ${message}`, data);
    }

    static error(message, error = null) {
        console.error(`[ERROR] ${message}`, error);
    }

    static warn(message, data = null) {
        console.warn(`[WARN] ${message}`, data);
    }
}

export default Logger;