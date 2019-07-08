import Base from '../core/base';

export default class VectorTileSource extends Base{
  constructor(cfg, workerController) {
    super({
      type: 'vector',
      ...cfg
    });
    this.workerController = workerController;
  }
  loadTile(tile, callback) {
    const params = {
      id: tile,
    };
    this.workerController.send('loadTile', params, done.bind(this));
    function done(err,data) {
      callback();
    }
  }
  abortTile(tile) {
    this.workerController.send('abortTile', { uid: tile.uid, type: this.type, source: this.id }, undefined, tile.workerID);
  }
  unloadTile(tile) {
    this.workerController.send('removeTile', { uid: tile.uid, type: this.type, source: this.id }, undefined, tile.workerID);
  }
}
