import Source from '../core/source';
// import Controller from '../core/controller/index';
import { getArrayBuffer } from '../util/ajax';
export default class Worker {
  constructor(self) {
    this.self = self;
    this.self.addEventListener('message', cfg => {
      this.loadTile(cfg.data);
    });
  }

  loadTile(cfg) {
   // const tileSource = new TileSource(cfg.data, cfg.cfg);
    getArrayBuffer({ url: cfg.url }, (err, data) => {
      if (err) {
        this.self.postMessage(null);
        return;
      }
      const tileData = this._generateSource(cfg, data.data);
      console.log(tileData);
      const uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
      for (let i = 0; i < uInt8Array.length; ++i) {
        uInt8Array[i] = i;
      }

      console.time('postmessage');
      const b = function() {
        return 'update';
      };
      this.self.postMessage({ a: 
        uInt8Array.buffer,
        update: b
       }, [ uInt8Array.buffer, b ]);
      console.timeEnd('postmessage');
    });
  }
  _generateSource(cfg, data) {
    const tileData = new Source({
      ...cfg.sourceCfg,
      data
    });
    return tileData;
  }
}
self.worker = new Worker(self);
