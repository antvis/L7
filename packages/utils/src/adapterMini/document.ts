import HTMLElement from './HTMLElement';
// import HTMLVideoElement from "./HTMLVideoElement";
// import Image from "./Image";
// import { getCanvas, getCanvas2D } from "./register";
// import Event from "./Event";

// interface IDocument {
//   readyState: string;
//   visibilityState: string;
//   hidden: boolean;
//   fullscreen: boolean;
//   scripts: any;
//   style: any;
//   ontouchstart: any;
//   ontouchmove: any;
//   ontouchend: any;
//   onvisibilitychange: any;
//   parentNode: any;
//   parentElement: any;
//   head: any;
//   body: any;
//   documentElement: any;
//   createElement: (tagName: string) => any;
//   createElementNS: (nameSpace: string, tagName: string) => any;
//   createTextNode: (text: string) => any;
//   getElementById: (id: string) => any;
//   getElementsByTagName: (tagName: string) => any;
//   getElementsByTagNameNS: (nameSpace: string, tagName: string) => any;
//   getElementsByName: (tagName: string) => any;
//   querySelector: (query: string) => any;
//   querySelectorAll: (query: string) => any;
//   addEventListener: (type: string, listener: any, options: any) => any;
//   removeEventListener: (type: string, listener: any) => any;
//   dispatchEvent: (event: Event) => any;
// }
// class Body extends HTMLElement {
//   constructor() {
//     // 为了性能, 此处不按照标准的DOM层级关系设计
//     // 将 body 设置为 0级, parent元素为null
//     super("body", 0);
//   }
//   addEventListener(type: string, listener: any, options = {}) {
//     document.addEventListener(type, listener, options);
//   }
//   removeEventListener(type: string, listener: any) {
//     document.removeEventListener(type, listener);
//   }
//   dispatchEvent(event: Event) {
//     document.dispatchEvent(event);
//   }
// }

class DocumentElement extends HTMLElement {
  constructor() {
    super('html', 0);
  }

  public addEventListener(type: string, listener: any, options = {}) {
    document.addEventListener(type, listener, options);
  }

  public removeEventListener(type: string, listener: any) {
    document.removeEventListener(type, listener);
  }

  public dispatchEvent(event: Event) {
    document.dispatchEvent(event);
  }
}

const events = {};

const document = {
  readyState: 'complete',
  visibilityState: 'visible', // 'visible' , 'hidden'
  hidden: false,
  fullscreen: true,

  scripts: [],
  style: {},

  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,
  onvisibilitychange: null,

  parentNode: null,
  parentElement: null,
  head: null,
  body: null,
  documentElement: null,
  createElement(tagName: string) {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      // return getCanvas2D();
    } else if (tagName === 'img') {
      // return new Image();
    } else if (tagName === 'video') {
      // return new HTMLVideoElement();
    }

    // return new HTMLElement(tagName);
  },

  createElementNS(nameSpace: string, tagName: string) {
    return this.createElement(tagName);
  },

  createTextNode(text: string) {
    // TODO: Do we need the TextNode Class ???
    return text;
  },

  getElementById(id: string) {
    // let canvas = getCanvas();
    // let canvas2D = getCanvas2D();
    // if (id === canvas.id) {
    //   return canvas;
    // } else if (id === canvas2D.id) {
    //   return canvas2D;
    // }
    return null;
  },

  getElementsByTagName(tagName: string) {
    // tagName = tagName.toLowerCase();
    // if (tagName === "head") {
    //   return [document.head];
    // } else if (tagName === "body") {
    //   return [document.body];
    // } else if (tagName === "canvas") {
    //   return [getCanvas(), getCanvas2D()];
    // }
    return [];
  },

  getElementsByTagNameNS(nameSpace: string, tagName: string) {
    return this.getElementsByTagName(tagName);
  },

  getElementsByName(tagName: string) {
    // if (tagName === "head") {
    //   return [document.head];
    // } else if (tagName === "body") {
    //   return [document.body];
    // } else if (tagName === "canvas") {
    //   return [getCanvas(), getCanvas2D()];
    // }
    return [];
  },

  querySelector(query: string) {
    // let canvas = getCanvas();
    // let canvas2D = getCanvas2D();
    // if (query === "head") {
    //   return document.head;
    // } else if (query === "body") {
    //   return document.body;
    // } else if (query === "canvas") {
    //   return canvas;
    // } else if (query === `#${canvas.id}`) {
    //   return canvas;
    // } else if (query === `#${canvas2D.id}`) {
    //   return canvas2D;
    // }
    return null;
  },

  querySelectorAll(query: string) {
    // if (query === "head") {
    //   return [document.head];
    // } else if (query === "body") {
    //   return [document.body];
    // } else if (query === "canvas") {
    //   return [getCanvas(), getCanvas2D()];
    // }
    return [];
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
};

// document.documentElement = new DocumentElement();
// document.head = new HTMLElement("head");
// document.body = new Body();

export default document;
