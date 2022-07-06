let l7globalThis: any;

const getGlobalThis = (): any => {
  return (
    l7globalThis ||
    (l7globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  );
};
l7globalThis = getGlobalThis();

// TODO: 解决 gastby 服务端构建过程中没有 window 全局变量的问题
let globalWindow: Window & typeof l7globalThis;

if (typeof window === 'undefined') {
  globalWindow = ({
    devicePixelRatio: 1,
    navigator: {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      browserLanguage: 'zh-CN',
      language: 'zh-CN',
      platform: '',
    },
    location: '',
    document: {
      documentElement: {
        style: {},
      },
      createEvent: () => true,
      getElementById: (id: string) => true,
      createElement: () => {
        return {
          className: '',
          classList: {
            add: () => '',
          },
        };
      },
      createElementNS: () => true,
      addEventListener: () => true,
      removeEventListener: () => true,
      querySelector: () => false,
    },
    performance: {
      mark: (mark: string) => null,
      clearMeasures: (measure: string) => null,
      clearMarks: (mark: string) => null,
      measure: (mark: string, create: string, load: string) => {
        return {
          duration: 0,
        };
      },
      now: () => new Date().getTime(),
    },

    Blob: '',
    dispatchEvent: (evt: any) => true,
    Event: (name: string, data: any) => true,
    createElement: () => true,
    createElementNS: () => true,
    XMLHttpRequest: () => true,
    addEventListener: () => true,
    removeEventListener: () => true,
    requestAnimationFrame: () => true,
    cancelAnimationFrame: () => true,
    clearTimeout: () => true,
  } as unknown) as Window & typeof globalThis;
} else {
  globalWindow = window;
}

export { globalWindow, getGlobalThis, l7globalThis };
