// @ts-nocheck
// tslint:disable
import { atob, btoa } from './atob';
import { Blob } from './blob';
import devicePixelRatio from './devicePixelRatio';
import { document } from './document';
import { Element } from './Element';
import { Event } from './Event';
import EventTarget from './EventTarget';
import { HTMLCanvasElement } from './HTMLCanvasElement';
import { HTMLElement } from './HTMLElement';
import { HTMLMediaElement } from './HTMLMediaElement';
import { HTMLVideoElement } from './HTMLVideoElement';
import { Image } from './Image';
import { ImageData } from './ImageData';
import { location } from './location';
import { navigator } from './navigator';
import { Node } from './Node';
import { performance } from './performance';
import {
  cancelAnimationFrame,
  requestAnimationFrame,
} from './requestAnimationFrame';
import { screen } from './screen';
import { URL } from './url';
import { WebGLRenderingContext } from './WebGL';
import { WebGL2RenderingContext } from './WebGL2';
import { XMLHttpRequest } from './XMLHttpRequest';

const window = {
  atob,
  btoa,
  devicePixelRatio,
  Blob,
  document,
  Element,
  Event,
  EventTarget,
  HTMLCanvasElement,
  HTMLElement,
  HTMLMediaElement,
  HTMLVideoElement,
  Image,
  navigator,
  Node,
  requestAnimationFrame,
  cancelAnimationFrame,
  screen,
  XMLHttpRequest,
  performance,
  URL,
  WebGL2RenderingContext,
  addEventListener(type, listener, options = {}) {
    document.addEventListener(type, listener, options);
  },
  removeEventListener(type, listener,options) {
    document.removeEventListener(type, listener);
  },
  dispatchEvent(event: Event) {
    document.dispatchEvent(event);
  },
  innerWidth: screen.availWidth,
  innerHeight: screen.availHeight,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};

export {
  btoa,
  URL,
  Blob,
  window,
  atob,
  devicePixelRatio,
  document,
  Element,
  Event,
  EventTarget,
  HTMLCanvasElement,
  HTMLElement,
  HTMLMediaElement,
  HTMLVideoElement,
  Image,
  navigator,
  Node,
  requestAnimationFrame,
  cancelAnimationFrame,
  screen,
  XMLHttpRequest,
  performance,
  WebGLRenderingContext,
  WebGL2RenderingContext,
  ImageData,
  location,
};
export {
  window as $window,
  document as $document,
  XMLHttpRequest as $XMLHttpRequest,
  location as $location,
};

export { registerCanvas, registerCanvas2D } from './register';

// 判断时候是支付宝小程序环境
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';
  
export const isMini = isMiniAli;

export * from './EventIniter/index';
