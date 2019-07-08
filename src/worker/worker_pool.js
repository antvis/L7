import WebWorker from './web_worker';

/**
 * Constructs a worker pool.
 * @private
 */
export default class WorkerPool {

  constructor() {
    this.active = {};
  }

  acquire(mapId) {
    if (!this.workers) {
      // Lazily look up the value of mapboxgl.workerCount so that
      // client code has had a chance to set it.
      this.workers = [];
      while (this.workers.length < WorkerPool.workerCount) {
        this.workers.push(new WebWorker());
      }
    }

    this.active[mapId] = true;
    return this.workers.slice();
  }

  release(mapId) {
    delete this.active[mapId];
    if (Object.keys(this.active).length === 0) {
      this.workers.forEach(w => {
        w.terminate();
      });
      this.workers = null;
    }
  }
}

WorkerPool.workerCount = Math.max(Math.floor(window.navigator.hardwareConcurrency / 2), 1);
