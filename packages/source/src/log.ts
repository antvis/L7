export class Log {
    private logs: {
        [key: string]: any
    } = {};

    log(type: string) {
        this.logs[type] = Date.now();
    }

    getLogs() {
        return this.logs;
    }
}