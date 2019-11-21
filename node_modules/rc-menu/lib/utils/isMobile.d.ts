declare function isMobile(userAgent?: string): {
    apple: {
        phone: boolean;
        ipod: any;
        tablet: boolean;
        device: boolean;
    };
    amazon: {
        phone: any;
        tablet: any;
        device: any;
    };
    android: {
        phone: any;
        tablet: any;
        device: any;
    };
    windows: {
        phone: any;
        tablet: any;
        device: any;
    };
    other: {
        blackberry: any;
        blackberry10: any;
        opera: any;
        firefox: any;
        chrome: any;
        device: any;
    };
    any: any;
    phone: any;
    tablet: any;
};
declare const defaultResult: {
    isMobile: typeof isMobile;
    apple: {
        phone: boolean;
        ipod: any;
        tablet: boolean;
        device: boolean;
    };
    amazon: {
        phone: any;
        tablet: any;
        device: any;
    };
    android: {
        phone: any;
        tablet: any;
        device: any;
    };
    windows: {
        phone: any;
        tablet: any;
        device: any;
    };
    other: {
        blackberry: any;
        blackberry10: any;
        opera: any;
        firefox: any;
        chrome: any;
        device: any;
    };
    any: any;
    phone: any;
    tablet: any;
};
export default defaultResult;
