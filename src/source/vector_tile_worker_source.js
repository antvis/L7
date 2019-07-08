import Base from '../core/base';
import { getArrayBuffer } from '../util/ajax';
const tileURLRegex = /\{([zxy])\}/g;
import PBF from 'pbf';
import * as VectorParser from '@mapbox/vector-tile';
import WorkerTile from '../worker/workerTile';
// import WorkerTile from '../worker/workerTile';
export default class VectorTileSource extends Base {
  constructor(cfg, workerController) {
    super({
      type: 'vector',
      ...cfg
    });
    this.workerController = workerController;
  }
  loadVectorTile(params, callback) {
    const request = getArrayBuffer(params.request, (err, data) => {
      if (err) {
        callback(err);
      } else if (data) {
        callback(null, {
          vectorTile: new VectorParser.VectorTile(new PBF(data)),
          rawData: data
        });
      }
    });
    return () => {
      request.cancel();
      callback();
    };
  }
  loadTile(params, callback) {
    console.log(params);
    const workerTile = new WorkerTile(params);
    workerTile.abort = this.loadVectorData(params, (err, response) => {

    });


  }
  abortTile() {

  }
  unloadTile() {

  }
  hasTransition() {

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
