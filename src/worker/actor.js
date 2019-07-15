import { serialize } from './worker_transform';
function bindAll(fns, context) {
  fns.forEach(fn => {
    if (!context[fn]) { return; }
    context[fn] = context[fn].bind(context);
  });
}

export default class Actor {
  constructor(target, parent, mapId) {
    this.target = target;
    this.parent = parent;
    this.mapId = mapId;
    this.callbacks = {};
    this.callbackID = 0;
    bindAll([ 'receive' ], this);
    this.target.addEventListener('message', this.receive, false);

  }
  send(type, data, callback, targetMapId) {
    const id = callback ? `${this.mapId}_${this.callbackID++}` : null;
    if (callback) this.callbacks[id] = callback;
    const buffer = [];
    this.target.postMessage({
      targetMapId,
      sourceMapId: this.mapId,
      type,
      id: String(id),
      data
    }, buffer);
    if (callback) {
      return {
        cancel: () => this.target.postMessage({
          targetMapId,
          sourceMapId: this.mapId,
          type: '<cancel>',
          id: String(id)
        })
      };
    }
  }
  receive(message) {
    // TODO 处理中断Worker
    const data = message.data;
    const id = data.id;
    let callback;
    const done = (err, data) => {
      delete this.callbacks[id];
      const buffers = [];
      this.target.postMessage({ // 发送结果数据
        sourceMapId: this.mapId,
        type: '<response>',
        id: String(id),
        error: err ? JSON.stringify(err) : null,
        data: serialize(data, buffers)
      }, buffers);
    };
    if (data.type === '<response>' || data.type === '<cancel>') {
      callback = this.callbacks[data.id];
      delete this.callbacks[data.id];
      if (callback && data.error) {
        callback(data.error);
      } else if (callback) {
        callback(null, data.data);
      }

    } else if (typeof data.id !== 'undefined' && this.parent[data.type]) { // loadTile
      this.parent[data.type](data.sourceMapId, data.data, done);

    } else if (typeof data.id !== 'undefined' && this.parent.getWorkerSource) {
      const keys = data.type.split('.');
      const params = data.data;
      const workerSource = (this.parent).getWorkerSource(data.sourceMapId, keys[0], params.source);
      workerSource[keys[1]](params, done);
    } else {
      this.parent[data.type](data.data);
    }

  }
}
