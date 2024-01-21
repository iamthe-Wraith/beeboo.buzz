export class Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static error(...args: any[]) {
        console.error(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static warn(...args: any[]) {
        console.warn(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static info(...args: any[]) {
        console.info(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debug(...args: any[]) {
        console.debug(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static trace(...args: any[]) {
        console.trace(...args);
    }
}