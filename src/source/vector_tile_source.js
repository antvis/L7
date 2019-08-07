import Base from '../core/base';
const tileURLRegex = /\{([zxy])\}/g;
export default class VectorTileSource extends Base {
  constructor(cfg, workerController) {
    super({
      type: 'vector',
      ...cfg
    });
    this.cfg = cfg;
    this.workerController = workerController;
    this.urlTemplate = this.get('url');
  }
  loadTile(tileinfo, callback) {
    const tileId = tileinfo.id.split('_');
    const url = this._getTileURL({
      x: tileId[0],
      y: tileId[1],
      z: tileId[2]
    });
    const params = {
      id: tileinfo.id,
      type: 'vector',
      ...this.cfg,
      url

    };
    tileinfo.workerID = this.workerController.send('loadTile', params, done.bind(this));
    function done(err, data) { // 收到数据，处理数据
      callback(err, data);
    }
  }
  abortTile(tileinfo) {
    this.workerController.send('abortTile', { id: tileinfo.id, type: this.get('type'), sourceID: this.get('sourceID') }, undefined, tileinfo.workerID);
  }
  unloadTile(tileinfo) {
    this.workerController.send('removeTile', { id: tileinfo.id, type: this.get('type'), sourceID: this.get('sourceID') }, undefined, tileinfo.workerID);
  }
  _getTileURL(urlParams) {
    if (!urlParams.s) {
      // Default to a random choice of a, b or c
      urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
    }

    tileURLRegex.lastIndex = 0;
    return this.urlTemplate.replace(tileURLRegex, function(value, key) {
      return urlParams[key];
    });
  }
}
