enum LoggerLevels {
    ERROR = 'error',
    WARNING = 'warning',
    INFORMATION = 'information'
}

type LogMessage = any[];

export class Logger {
    public static error(...log: LogMessage): void {
        this.sendLog(LoggerLevels.ERROR, ...log);
    }

    public static warn(...log: LogMessage): void {
        this.sendLog(LoggerLevels.WARNING, ...log);
    }

    public static log(...log: LogMessage): void {
        this.sendLog(LoggerLevels.INFORMATION, ...log);
    }

    private static sendLog(level: LoggerLevels, ...log: LogMessage): void {
        if (!Logger.shouldShowLogs()) {
            return;
        }

        switch (level) {
            case LoggerLevels.ERROR:
                console.error(...log);
                break;
            case LoggerLevels.WARNING:
                console.warn(...log);
                break;
            default:
                console.log(...log);
        }
    }

    // A check should be added for dev environment
    private static shouldShowLogs(): boolean {
        return false;
    }
}