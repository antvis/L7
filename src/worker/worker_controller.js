
import Actor from './actor';
let id = 1;
function asyncAll(
  array,
  fn,
  callback
) {
  if (!array.length) { return callback(null, []); }
  let remaining = array.length;
  const results = new Array(array.length);
  let error = null;
  array.forEach((item, i) => {
    fn(item, (err, result) => {
      if (err) error = err;
      results[i] = ((result));
      if (--remaining === 0) callback(error, results);
    });
  });
}

export default class WorkerController {
  constructor(workerPool, parent) {
    this.workerPool = workerPool;
    this.actors = [];
    this.currentActor = 0;
    this.id = id++;
    const workers = this.workerPool.acquire(this.id);

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const actor = new WorkerController.Actor(worker, parent, this.id);
      actor.name = `Worker ${i}`;
      this.actors.push(actor);
    }
  }

  /**
   * Broadcast a message to all Workers.
   */

  broadcast(type, data, cb) {
    cb = cb || function() { };
    asyncAll(this.actors, (actor, done) => {
      actor.send(type, data, done);
    }, cb);
  }


  send(type, data, callback, targetID) {
    console.log('消息发送', data);
    if (typeof targetID !== 'number' || isNaN(targetID)) {
      // Use round robin to send requests to web workers.
      targetID = this.currentActor = (this.currentActor + 1) % this.actors.length;
    }
    this.actors[targetID].send(type, data, callback, targetID);
    return targetID;
  }

  remove() {
    this.actors.forEach(actor => { actor.remove(); });
    this.actors = [];
    this.workerPool.release(this.id);
  }


}
WorkerController.Actor = Actor;

