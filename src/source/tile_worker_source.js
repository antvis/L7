import Base from '../core/base';

export default class TileWorkerSource extends Base {
  constructor(cfg) {
    super(cfg);
    this.workerPool = this.get('workerPool');
    this.type = 'tile';
  }
  loadTile({ tile, url }) {
    this.get('sourceCfg').parser.tile = tile;
    return this.workerPool.runTask({
      url,
      attrs: this.get('attrs'),
      sourceCfg: this.get('sourceCfg')
    });
  }
}
