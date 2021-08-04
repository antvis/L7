import document from './document';

export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';

const aliMiniWin = {
  // atob,
  // @ts-ignore
  devicePixelRatio: isMiniAli
    ? // @ts-ignore
      my?.getSystemInfoSync()?.devicePixelRatio || 1
    : 1,
  document,
  // Element,
  // Event,
  // EventTarget,
  // HTMLCanvasElement,
  // HTMLElement,
  // HTMLMediaElement,
  // HTMLVideoElement,
  // Image,
  // navigator,
  // Node,
  // requestAnimationFrame,
  // screen,
  // XMLHttpRequest,
  // performance,
  // WebGL2RenderingContext,
  // addEventListener(type: string, listener: any, options = {}) {
  //   document.addEventListener(type, listener, options);
  // },
  // removeEventListener(type: string, listener: any) {
  //   document.removeEventListener(type, listener);
  // },
  // dispatchEvent(event: Event) {
  //   document.dispatchEvent(event);
  // }
};

export const l7window = isMiniAli ? aliMiniWin : window;
