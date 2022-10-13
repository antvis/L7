// @ts-nocheck
// tslint:disable
import { Event } from './Event';
import { HTMLElement } from './HTMLElement';
import { HTMLVideoElement } from './HTMLVideoElement';
import { Image } from './Image';
import { $location } from './location';

class Body extends HTMLElement {
  constructor() {
    // 为了性能, 此处不按照标准的DOM层级关系设计
    // 将 body 设置为 0级, parent元素为null
    super('body', 0);
  }

  public addEventListener(type, listener, options = {}) {
    // document.addEventListener(type, listener, options);
  }

  public removeEventListener(type, listener, options) {
    // document.removeEventListener(type, listener);
  }

  public dispatchEvent(event: Event) {
    // document.dispatchEvent(event);
  }
}

class DocumentElement extends HTMLElement {
  constructor() {
    super('html', 0);
  }

  public addEventListener(type, listener, options = {}) {
    // document.addEventListener(type, listener, options);
  }

  public removeEventListener(type, listener) {
    // document.removeEventListener(type, listener);
  }

  public dispatchEvent(event: Event) {
    // document.dispatchEvent(event);
  }
}

const events = {};

export const $document = {
  readyState: 'complete',
  visibilityState: 'visible', // 'visible' , 'hidden'
  hidden: false,
  fullscreen: true,

  scripts: [],
  style: {},

  location: $location,

  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,
  onvisibilitychange: null,

  parentNode: null,
  parentElement: null,
  head: null,
  body: null,
  documentElement: {
    style: [] as any[],
  },
  createElement(tagName) {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      // return getCanvas();
      // @ts-ignore
      return my.createOffscreenCanvas(1024, 128, '2d');
    } else if (tagName === 'img') {
      return new Image();
    } else if (tagName === 'video') {
      return new HTMLVideoElement();
    }

    return new HTMLElement(tagName);
  },

  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },

  createTextNode(text) {
    // TODO: Do we need the TextNode Class ???
    return text;
  },

  getElementById(id) {
    return null;
  },

  getElementsByTagName(tagName) {
    tagName = tagName.toLowerCase();
    return [];
  },

  getElementsByTagNameNS(nameSpace, tagName) {
    return this.getElementsByTagName(tagName);
  },

  getElementsByName(tagName) {
    return [];
  },

  querySelector(query) {
    return null;
  },

  querySelectorAll(query) {
    return [];
  },

  addEventListener(type, listener, options) {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },

  removeEventListener(type, listener) {
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
    const listeners = events[type];

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }

    if (event.target && typeof event.target['on' + type] === 'function') {
      event.target['on' + type](event);
    }
  },
  createEvent(type: string) {
    return new Event(type);
  },
};

$document.documentElement = new DocumentElement();
$document.head = new HTMLElement('head');
$document.body = new Body();
