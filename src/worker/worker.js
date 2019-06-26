import Source from '../core/source';
import TileSource from '../source/tile_source';
import { getArrayBuffer } from '../util/ajax';
export default class Worker {
  constructor(self) {
    this.self = self;
    this.self.addEventListener('message', cfg => {
      const sourceCfg = cfg.data;
      this.loadTile(sourceCfg);
    });
  }
  loadTile(cfg) {
    const tileSource = new TileSource(cfg.data, cfg.cfg);
    console.log(tileSource);
    this.self.postMessage('success');
  }
}
self.worker = new Worker(self);
