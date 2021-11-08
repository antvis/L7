// @ts-nocheck
import { globalWindow } from './global';
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';
export default !isMiniAli
  ? globalWindow.devicePixelRatio
  : (my.getSystemInfoSync().pixelRatio as number);
