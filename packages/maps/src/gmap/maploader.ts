/* eslint-disable */
if (!window) {
  throw Error('Google Map JSAPI can only be used in Browser.');
}

enum LoadStatus {
  notload = 'notload',
  loading = 'loading',
  loaded = 'loaded',
  failed = 'failed',
}

interface ILoadOption {
  key: string;
}

const config: ILoadOption = {
  key: '',
};

let Status = {
  GMap: LoadStatus.notload,
};

const onloadCBKs: any[] = [];
// @ts-ignore
const onload = (callback: (map: window.AMap) => void) => {
  if (typeof callback === 'function') {
    if (Status.GMap === LoadStatus.loaded) {
      // @ts-ignore
      callback(window.google.maps.Map);
      return;
    }
    onloadCBKs.push(callback);
  }
};

const load = (options: ILoadOption) => {
  return new Promise((resolve, reject) => {
    if (Status.GMap === LoadStatus.failed) {
      reject('');
    } else if (Status.GMap === LoadStatus.notload) {
      const { key } = options;
      if (!key) {
        reject('请填写key');
        return;
      }

      config.key = key;
      Status.GMap = LoadStatus.loading;

      (window as any).initMap = (err: any) => {
        delete (window as any).initMap;
        if (err) {
          Status.GMap = LoadStatus.failed;
          reject(err);
        } else {
          Status.GMap = LoadStatus.loaded;
          while (onloadCBKs.length) {
            // @ts-ignore
            onloadCBKs.splice(0, 1)[0](window.google.maps.Map);
          }
        }
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = false;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.key}&callback=initMap`;

      script.onerror = (e) => {
        Status.GMap = LoadStatus.failed;
        reject(e);
      };

      const parentNode = document.body || document.head;
      parentNode.appendChild(script);
      onload(resolve);
    } else if (Status.GMap === LoadStatus.loaded) {
      if (options.key && options.key !== config.key) {
        reject('多个不一致的 key');
        return;
      }
      onload(resolve);
    }
  });
};

const reset = () => {
  // @ts-ignore
  delete window.google;
  Status = {
    GMap: LoadStatus.notload,
  };
};

export default { load, reset };
