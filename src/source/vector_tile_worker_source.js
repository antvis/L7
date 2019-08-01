
import { getArrayBuffer } from '../util/ajax';
import PBF from 'pbf';
import * as VectorParser from '@mapbox/vector-tile';
import WorkerTile from '../worker/workerTile';
// import WorkerTile from '../worker/workerTile';

function loadVectorTile(params, callback) {
  const request = getArrayBuffer({ url: params.url }, (err, data) => {
    if (err) {
      callback(err);
    } else if (data) {
      callback(null, {
        vectorTile: new VectorParser.VectorTile(new PBF(data.data)),
        rawData: data.data
      });
    }
  });
  return () => {
    request.abort();
    callback();
  };
}
export default class VectorTileWorkerSource {
  constructor(actor, layerStyle, loadVectorData) {
    this.actor = actor;
    this.layerStyle = layerStyle;
    this.loadVectorData = loadVectorData || loadVectorTile;
    this.loaded = {};
    this.loading = {};
  }
  loadTile(params, callback) {
    const uid = params.id;
    if (!this.loading) {
      this.loading = {};
    }
    const workerTile = this.loading[uid] = new WorkerTile(params);
    workerTile.abort = this.loadVectorData(params, (err, response) => {
      if (err || !response) {
        workerTile.status = 'done';
        this.loaded[uid] = workerTile;
        return callback(err);
      }
      // const rawTileData = response.rawData;
      workerTile.vectorTile = response.vectorTile;
      workerTile.parse(response.vectorTile, this.layerStyle, this.actor, (err, result) => {
        if (err || !result) return callback(err);
        // Transferring a copy of rawTileData because the worker needs to retain its copy.
        callback(null, {
          // rawTileData: rawTileData.slice(0),
          ...result
        });
      });

      this.loaded = this.loaded || {};
      this.loaded[uid] = workerTile;
    });


  }
  abortTile(params, callback) {
    const loading = this.loading;
    const uid = params.id;
    if (loading && loading[uid] && loading[uid].abort) {
      loading[uid].abort();
      delete loading[uid];
    }
    callback();
  }
  reloadTile(params, callback) { // 重新加载 tile
    const loaded = this.loaded,
      uid = params.id,
      vtSource = this;
    if (loaded && loaded[uid]) {
      const workerTile = loaded[uid];
      const done = (err, data) => {
        const reloadCallback = workerTile.reloadCallback;
        if (reloadCallback) {
          delete workerTile.reloadCallback;
          workerTile.parse(workerTile.vectorTile, vtSource.layerStyle, vtSource.actor, reloadCallback);
        }
        callback(err, data);
      };

      if (workerTile.status === 'parsing') {
        workerTile.reloadCallback = done;
      } else if (workerTile.status === 'done') {
        // if there was no vector tile data on the initial load, don't try and re-parse tile
        if (workerTile.vectorTile) {
          workerTile.parse(workerTile.vectorTile, this.layerIndex, this.actor, done);
        } else {
          done();
        }
      }
    }
  }
  removeTile(params, callback) {
    const loaded = this.loaded,
      uid = params.id;
    if (loaded && loaded[uid]) {
      delete loaded[uid];
    }
    callback();
  }
  unloadTile() {

  }
  hasTransition() {

  }
}
