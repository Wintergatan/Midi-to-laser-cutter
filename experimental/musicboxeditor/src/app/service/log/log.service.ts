import { Injectable } from '@angular/core';

export interface ILogEntry {
    timestamp: Date,
    level: string,
    context: string,
    message: string;
}

@Injectable()
export class LogService {

    constructor() {

    }

    public createLogger(context: string) {
        return new Logger(context, this);
    }

    public log(context: string, level: string, message: string) {
        var logEntry: ILogEntry = {
            timestamp: new Date(),
            level: level,
            context: context,
            message: message
        };

        this.writeToConsole(logEntry);
    }

    public writeToConsole(logEntry: ILogEntry) {
        var s = '';
        s += logEntry.timestamp.toLocaleString();
        s += ' ' + logEntry.context;
        s += ' Msg: ' + logEntry.message;

        console.log(logEntry.level + ': ' + s);
    }
}

export class Logger {
    logService: LogService;
    context: string;

    constructor(context: string, logService: LogService) {
        this.context = context;
        this.logService = logService;
    }

    public log(message: string) {
        this.logService.log(this.context, 'INFO', message);
    }

    public logDebug(message: string) {
        this.logService.log(this.context, 'DEBUG', message);
    }

    public logError(message: string) {
        this.logService.log(this.context, 'ERROR', message);
    }
}
