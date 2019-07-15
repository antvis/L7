import VectorTileWorkerSource from '../source/vector_tile_worker_source';
import Actor from './actor';
// 统一管理workerSource 实例化
export default class Worker {
  constructor(self) {
    this.self = self;
    this.actor = new Actor(self, this);
    this.workerSourceTypes = {
      vector: VectorTileWorkerSource
    };
    this.workerSources = {};
    this.self.registerWorkerSource = (name, WorkerSource) => {
      if (this.workerSourceTypes[name]) {
        throw new Error(`Worker source with name "${name}" already registered.`);
      }
      this.workerSourceTypes[name] = WorkerSource;
    };
    this.layerStyles = {};
  }

  loadTile(mapId, params, callback) {
    this.getWorkerSource(mapId, params.type, params.sourceID).loadTile(params, callback);
  }
  abortTile(mapId, params, callback) {
    this.getWorkerSource(mapId, params.type, params.sourceID).abortTile(params, callback);
  }
  removeTile(mapId, params, callback) {
    this.getWorkerSource(mapId, params.type, params.sourceID).removeTile(params, callback);
  }
  setLayers(mapId, layercfgs, callback) {
    this.layerStyles[mapId] = layercfgs; // mapid layerID
    if (this.workerSources[mapId]) {
      for (const sourceId in this.workerSources[mapId].vector) {
        this.workerSources[mapId].vector[sourceId].layerStyle = layercfgs;
      }
    }
    callback();
  }
  updateLayers(id, params, callback) {

  }
  /**
   * 获取workerSource
   * @param {string} mapId WorkerPool Id
   * @param {string} type 瓦片类型 目前支持Vector
   * @param {string} source souce ID
   * @return {*} WorkerSource
   */
  getWorkerSource(mapId, type, source) {
    if (!this.workerSources[mapId]) {
      this.workerSources[mapId] = {};
    }
    if (!this.workerSources[mapId][type]) {
      this.workerSources[mapId][type] = {};
    }
    if (!this.workerSources[mapId][type][source]) {
      // use a wrapped actor so that we can attach a target mapId param
      // to any messages invoked by the WorkerSource
      const actor = {
        send: (type, data, callback) => {
          this.actor.send(type, data, callback, mapId);
        }
      };
      this.workerSources[mapId][type][source] = new this.workerSourceTypes[type](actor, this.layerStyles[mapId]);
    }
    return this.workerSources[mapId][type][source];
  }
}
self.worker = new Worker(self);
