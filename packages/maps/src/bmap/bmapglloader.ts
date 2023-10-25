interface ILoadOption {
  key: string;
  version?: string;
}

if (!window) {
  throw Error('BMapGL JSAPI can only be used in Browser.');
}
enum LoadStatus {
  notload = 'notload',
  loading = 'loading',
  loaded = 'loaded',
  failed = 'failed',
}

let config = {
  key: '',
  BMapGL: {
    version: '1.0',
  },
};

let Status = {
  BMapGL: LoadStatus.notload,
};

type OnLoadedCb = (api: typeof BMapGL) => void;

const onloadCBKs: OnLoadedCb[] = [];

const onload = (callback: OnLoadedCb) => {
  if (typeof callback === 'function') {
    if (Status.BMapGL === LoadStatus.loaded) {
      callback(window.BMapGL);
      return;
    }
    onloadCBKs.push(callback);
  }
};

const load = (options: ILoadOption) => {
  return new Promise((resolve, reject) => {
    if (Status.BMapGL === LoadStatus.failed) {
      reject('');
    } else if (Status.BMapGL === LoadStatus.notload) {
      // 初次加载
      const { key, version } = options;
      if (!key) {
        reject('请填写key');
        return;
      }
      config.key = key;
      config.BMapGL.version = version || config.BMapGL.version;
      Status.BMapGL = LoadStatus.loading;
      const parentNode = document.body || document.head;
      (window as any).___onBMapGLAPILoaded = (err: any) => {
        delete (window as any).___onBMapGLAPILoaded;
        if (err) {
          Status.BMapGL = LoadStatus.failed;
          reject(err);
        } else {
          Status.BMapGL = LoadStatus.loaded;
          while (onloadCBKs.length) {
            onloadCBKs.splice(0, 1)[0](window.BMapGL);
          }
        }
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://api.map.baidu.com/api?type=webgl&v=${config.BMapGL.version}&ak=${config.key}&callback=___onBMapGLAPILoaded`;
      script.onerror = (e) => {
        Status.BMapGL = LoadStatus.failed;
        reject(e);
      };
      parentNode.appendChild(script);
      onload(resolve);
    } else if (Status.BMapGL === LoadStatus.loaded) {
      // deal multi load
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }
      if (options.version && options.version !== config.BMapGL.version) {
        reject('不允许多个版本 JSAPI 混用');
        return;
      }
      resolve(window.BMapGL);
    } else {
      // loading
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }
      if (options.version && options.version !== config.BMapGL.version) {
        reject('不允许多个版本 JSAPI 混用');
        return;
      }
      onload(resolve);
    }
  });
};

const reset = () => {
  // @ts-ignore
  delete window.BMapGL;
  config = {
    key: '',
    BMapGL: {
      version: '1.0',
    },
  };
  Status = {
    BMapGL: LoadStatus.notload,
  };
};
export default { load, reset };
