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
    bindAll(['receive'], this);
    this.target.addEventListener('message', this.receive, false);

  }
  send(type, data, callback, targetMapId) {
    const id = callback ? `${this.mapId}_${this.callbackID++}` : null;
    if (callback) this.callbacks[id] = callback;
    const buffers = [];
    this.target.postMessage({
      targetMapId,
      sourceMapId: this.mapId,
      type,
      id: String(id),
      data
    }, buffers);
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
    const data = message.data;
    const id = data.id;
    if (Object.keys(this.callbacks).length === 0) {
      this.target.postMessage({ // worker向主线程发送结果数据
        sourceMapId: this.mapId,
        type: '<response>',
        id: String(id),
        data: 'callback'
      });
    }
    if (typeof data.id !== 'undefined' && this.parent[data.type]) {
      console.log(data.type);
    }
      // TODO worker 处理数据 创建worker source 根据类型调用响应的方法
    if (data.type === '<response>' || data.type === '<cancel>') {
      this.callbacks[id](id);
      delete this.callbacks[id]; // 回调执行

    }
  }
}
