// @ts-nocheck
// tslint:disable
import { atob, btoa } from './atob';
import { Blob } from './blob';
import devicePixelRatio from './devicePixelRatio';
import { $document } from './document';
import { Element } from './Element';
import { Event } from './Event';
import EventTarget from './EventTarget';
import { HTMLCanvasElement } from './HTMLCanvasElement';
import { HTMLElement } from './HTMLElement';
import { HTMLMediaElement } from './HTMLMediaElement';
import { HTMLVideoElement } from './HTMLVideoElement';
import { Image } from './Image';
import { ImageData } from './ImageData';
import { $location as $location2 } from './location';
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
import { $XMLHttpRequest as $XMLHttpRequest2 } from './XMLHttpRequest';

import { globalWindow, l7globalThis } from './global';

export let isMiniScene = false;
export function setMiniScene(flag: boolean) {
  isMiniScene = flag;
}

// 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' &&
  !!my &&
  typeof my.showToast === 'function' &&
  my.isFRM !== true;

export const isWeChatMiniProgram =
  typeof wx !== 'undefined' &&
  wx !== null &&
  (typeof wx.request !== 'undefined' || typeof wx.miniProgram !== 'undefined');

export const isMini = (isMiniAli || isWeChatMiniProgram) && isMiniScene;

export const miniWindow = {
  atob,
  btoa,
  devicePixelRatio,
  Blob,
  document: $document,
  Element,
  Event,
  EventTarget,
  HTMLCanvasElement,
  HTMLElement,
  HTMLMediaElement,
  HTMLVideoElement,
  Image,
  ImageData,
  navigator,
  Node,
  requestAnimationFrame,
  cancelAnimationFrame,
  screen,
  XMLHttpRequest: $XMLHttpRequest2,
  performance,
  URL,
  WebGLRenderingContext,
  WebGL2RenderingContext,
  addEventListener(type, listener, options = {}) {
    $document.addEventListener(type, listener, options);
  },
  removeEventListener(type, listener, options) {
    $document.removeEventListener(type, listener);
  },
  dispatchEvent(event: Event) {
    $document.dispatchEvent(event);
  },
  innerWidth: screen.availWidth,
  innerHeight: screen.availHeight,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
} as Window & typeof l7globalThis;

export const $window = isMini ? miniWindow : globalWindow;
export const $XMLHttpRequest = isMini
  ? $XMLHttpRequest2
  : globalWindow.XMLHttpRequest;
export const $location = isMini ? $location2 : globalWindow.location;

// TODO:
// export { registerCanvas, registerCanvas2D } from './register';

export * from './EventIniter/index';
