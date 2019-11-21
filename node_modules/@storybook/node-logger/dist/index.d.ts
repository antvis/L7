import npmLog from 'npmlog';
export declare const colors: {
    pink: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    purple: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    orange: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    green: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    blue: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    red: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    gray: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
};
export declare const logger: {
    info: (message: string) => void;
    plain: (message: string) => void;
    line: (count?: number) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    trace: ({ message, time }: {
        message: string;
        time: [number, number];
    }) => void;
    setLevel: (level?: string) => void;
};
export { npmLog as instance };
