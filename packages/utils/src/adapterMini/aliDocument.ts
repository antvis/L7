import Event from './Event';
const events = {};

export default {
  documentElement: {
    style: [],
  },
  createElementNS: (namespaceURI: string, tagName: string) => {
    return null;
  },
  createElement: (tagName: string) => {
    if (tagName === 'canvas') {
      // 当创建 canvas 对象的时候使用小程序提供的方法创建离屏 canvas
      // @ts-ignore
      return my.createOffscreenCanvas(124, 124, '2d');
    }
    return {
      className: [],
    };
  },

  addEventListener(type: string, listener: any, options: any) {
    // @ts-ignore
    if (!events[type]) {
      // @ts-ignore
      events[type] = [];
    }
    // @ts-ignore
    events[type].push(listener);
  },

  removeEventListener(type: string, listener: any) {
    // @ts-ignore
    const listeners = events[type];

    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },

  dispatchEvent(event: Event) {
    const type = event.type;
    // @ts-ignore
    const listeners: any = events[type];

    if (listeners) {
      for (const item of listeners) {
        item(event);
      }
    }
    // @ts-ignore
    if (event.target && typeof event.target['on' + type] === 'function') {
      // @ts-ignore
      event.target['on' + type](event);
    }
  },

  querySelector: (q: string) => {
    if (q === 'meta[name="viewport"]') {
      return undefined;
    }
    return undefined;
  },
};
