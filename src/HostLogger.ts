export type HostLoggerComponent = "Host";


export class HostLogger {

    private static startMilli: number;

    static {

        HostLogger.resetTime();

    }

    public static resetTime() {

        HostLogger.startMilli = Date.now();

    }

    public static info(component: HostLoggerComponent, message: string, ...extra: any): void {

        const info = "[" + component + "] " + message;
        HostLogger.cInfo(info, ...extra);

    }

    public static error(component: HostLoggerComponent, message: string, ...extra: any): void {

        const info = "[" + component + "] " + message;
        HostLogger.cError(info, ...extra);

    }

    private static cInfo(message: string, ...extra: any) {

        message = HostLogger.elapsedMS() + " " + message;
        console.info(message, ...extra);

    }

    private static cError(message: string, ...extra: any) {

        message = HostLogger.elapsedMS() + " " + message;
        console.error(message, ...extra);

    }

    private static elapsedMS(): string {

        let milli = Date.now() - HostLogger.startMilli;

        let sec = Math.floor(milli / 1000);

        milli = milli % 1000;

        let min = Math.floor(sec / 60);

        sec = sec % 60;

        let hour = Math.floor(min / 60);

        min = min % 60;
        hour = hour % 24;

        const timestamp = (hour < 10 ? "0" + hour : hour)
            + ":" + (min < 10 ? "0" + min : min)
            + ":" + (sec < 10 ? "0" + sec : sec)
            + "." + (milli < 10 ? "00" + milli : (milli < 100 ? "0" + milli : milli))
        ;

        return timestamp;
    }

}
