/* eslint-disable */
if (!window) {
  throw Error('TMap JSAPI can only be used in Browser.');
}

enum LoadStatus {
  notload = 'notload',
  loading = 'loading',
  loaded = 'loaded',
  failed = 'failed',
}

interface ILoadOption {
  key: string;
  version?: string;
  libraries?: string[];
}

const config: ILoadOption = {
  key: '',
  version: '1.exp',
  libraries: [],
};

let Status = {
  TMap: LoadStatus.notload,
};

const onloadCBKs: any[] = [];
// @ts-ignore
const onload = (callback: (map: window.TMap) => void) => {
  if (typeof callback === 'function') {
    if (Status.TMap === LoadStatus.loaded) {
      callback(window.TMap);
      return;
    }
    onloadCBKs.push(callback);
  }
};

const load = (options: ILoadOption) => {
  return new Promise((resolve, reject) => {
    if (Status.TMap === LoadStatus.failed) {
      reject('');
    } else if (Status.TMap === LoadStatus.notload) {
      const { key, version, libraries } = options;
      if (!key) {
        reject('请填写key');
        return;
      }

      config.key = key;
      config.version = version || config.version;
      config.libraries = libraries || config.libraries;
      Status.TMap = LoadStatus.loading;

      (window as any)._onTMapAPILoaded = (err: any) => {
        delete (window as any)._onTMapAPILoaded;
        if (err) {
          Status.TMap = LoadStatus.failed;
          reject(err);
        } else {
          Status.TMap = LoadStatus.loaded;
          while (onloadCBKs.length) {
            onloadCBKs.splice(0, 1)[0](window.TMap);
          }
        }
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = false;
      script.src =
        'https://map.qq.com/api/gljs?callback=_onTMapAPILoaded&v=' +
        config.version +
        '&key=' +
        key +
        '&plugin=' +
        config.libraries!.join(',');
      script.onerror = (e) => {
        Status.TMap = LoadStatus.failed;
        reject(e);
      };

      const parentNode = document.body || document.head;
      parentNode.appendChild(script);
      onload(resolve);
    } else if (Status.TMap === LoadStatus.loaded) {
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }

      if (options.version && options.version !== config.version) {
        reject('不允许多个版本 JSAPI 混用');
        return;
      }

      onload(resolve);
    }
  });
};

const reset = () => {
  // @ts-ignore
  delete window.TMap;

  Status = {
    TMap: LoadStatus.notload,
  };
};

export default { load, reset };
