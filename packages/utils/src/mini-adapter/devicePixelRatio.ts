// @ts-nocheck 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
import { globalWindow } from './global';
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' &&
  !!my &&
  typeof my.showToast === 'function' &&
  my.isFRM !== true;
export default !isMiniAli
  ? globalWindow.devicePixelRatio
  : (my.getSystemInfoSync().pixelRatio as number);
