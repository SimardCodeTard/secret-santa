import { DateTime } from "luxon";

enum LoggingLevelsEnum {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NO_LOG = 4
}


const loggingLevel = process.env.NEXT_PUBLIC_LOGGING_LEVEL 
    ? Number(process.env.NEXT_PUBLIC_LOGGING_LEVEL) 
    : LoggingLevelsEnum.WARN;

const showDebug = (): boolean => loggingLevel <= LoggingLevelsEnum.DEBUG;
const showInfo = (): boolean => loggingLevel <= LoggingLevelsEnum.INFO;
const showWarn = (): boolean => loggingLevel <= LoggingLevelsEnum.WARN;
const showError = (): boolean => loggingLevel <= LoggingLevelsEnum.ERROR;

export const debug = async (message: unknown) => showDebug() && console.debug(`${DateTime.now().toISO()} [DEBUG] : ${message}`)
export const info = async (message: unknown) => showInfo() && console.info(`${DateTime.now().toISO()} [INFO] : ${message}`)
export const warn = async (message: unknown) => showWarn() && console.warn(`${DateTime.now().toISO()} [WARN] : ${message}`)
export const error = (error: Error | string) => {
    if(!showError()) return;
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? new Error().stack  as string : error.stack as string;
    console.error(`${DateTime.now().toISO()} [ERROR] : ${message}\r\n Stack trace: ${shortenStackTrace(stack)}`);
}

const shortenStackTrace = (stackTrace: string): string => {
    const lines = stackTrace.split('\n');
    const shortenedStackTrace = lines.slice(0, 10).join('\n');
    return shortenedStackTrace;
}