if (!window) {
  throw Error('AMap JSAPI can only be used in Browser.');
}
enum LoadStatus {
  notload = 'notload',
  loading = 'loading',
  loaded = 'loaded',
  failed = 'failed',
}
interface IConfig {
  key: string;
  AMap: {
    version: string;
    plugins: string[];
  };
}
let config: IConfig = {
  key: '',
  AMap: {
    version: '2.0',
    plugins: [],
  },
};

let Status = {
  AMap: LoadStatus.notload,
};
let Callback = {
  AMap: [],
};

const onloadCBKs: any[] = [];
// @ts-ignore
const onload = (callback: (map: window.AMap) => void) => {
  if (typeof callback === 'function') {
    if (Status.AMap === LoadStatus.loaded) {
      callback(window.AMap);
      return;
    }
    onloadCBKs.push(callback);
  }
};

interface ILoadOption {
  key: string;
  version?: string;
  plugins?: string[];
  AMapUI?: {
    version?: string;
    plugins?: string[];
  };
  Loca?: {
    version?: string;
  };
}

const load = async (options: ILoadOption) => {
  return new Promise((resolve, reject) => {
    if (Status.AMap === LoadStatus.failed) {
      reject('');
    } else if (Status.AMap === LoadStatus.notload) {
      // 初次加载
      const { key, version, plugins } = options;
      if (!key) {
        reject('请填写key');
        return;
      }
      if (window.AMap && location.host !== 'lbs.amap.com') {
        reject('禁止多种API加载方式混用');
      }
      config.key = key;
      config.AMap.version = version || config.AMap.version;
      config.AMap.plugins = plugins || config.AMap.plugins;
      Status.AMap = LoadStatus.loading;

      const parentNode = document.body || document.head;
      // @ts-ignore
      window._onAPILoaded = (err) => {
        // @ts-ignore
        if (err) {
          Status.AMap = LoadStatus.failed;
          reject(err);
        } else {
          Status.AMap = LoadStatus.loaded;
          resolve(null);
        }
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = false;
      script.src =
        'https://webapi.amap.com/maps?callback=_onAPILoaded&v=' +
        config.AMap.version +
        '&key=' +
        key +
        '&plugin=' +
        config.AMap.plugins.join(',');
      script.onerror = (e) => {
        Status.AMap = LoadStatus.failed;
        reject(e);
      };

      parentNode.appendChild(script);
    } else if (Status.AMap === LoadStatus.loaded) {
      // deal multi load
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }
      if (options.version && options.version !== config.AMap.version) {
        reject('不允许多个版本 JSAPI 混用');
        return;
      }
      const newPlugins: string[] = [];
      if (options.plugins) {
        // @ts-ignore
        options.plugins.forEach((p: string) => {
          if (config.AMap.plugins.indexOf(p) === -1) {
            newPlugins.push(p);
          }
        });
      }

      if (newPlugins.length) {
        window.AMap.plugin(newPlugins, () => {
          resolve(window.AMap);
        });
      }
    } else {
      // loading
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }
      if (options.version && options.version !== config.AMap.version) {
        reject('不允许多个版本 JSAPI 混用');
        return;
      }
      const newPlugins: string[] = [];
      if (options.plugins) {
        // @ts-ignore
        options.plugins.forEach((p: string) => {
          if (config.AMap.plugins.indexOf(p) === -1) {
            newPlugins.push(p);
          }
        });
      }
      onload(() => {
        if (newPlugins.length) {
          window.AMap.plugin(newPlugins, () => {
            resolve(window.AMap);
          });
        }
      });
    }
  });
};
function reset() {
  // @ts-ignore
  delete window.AMap;
  config = {
    key: '',
    AMap: {
      version: '1.4.15',
      plugins: [],
    },
  };
  Status = {
    AMap: LoadStatus.notload,
  };
  Callback = {
    AMap: [],
  };
}
export default { load, reset };
