// @ts-nocheck 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
import { globalWindow } from './global';
// 判断时候是支付宝小程序环境
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' &&
  !!my &&
  typeof my.showToast === 'function' &&
  my.isFRM !== true;
let screenWidth;
let screenHeight;
let windowWidth;
let windowHeight;
if (isMiniAli) {
  const myOptions = my.getSystemInfoSync();
  screenWidth = myOptions.screenWidth;
  screenHeight = myOptions.screenHeight;
  windowWidth = myOptions.windowWidth;
  windowHeight = myOptions.windowHeight;
} else {
  const { innerWidth, innerHeight } = globalWindow;
  screenWidth = innerWidth;
  screenHeight = innerHeight;
  windowWidth = innerWidth;
  windowHeight = innerHeight;
}

export const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: windowWidth,
  availHeight: windowHeight,
  availLeft: 0,
  availTop: 0,
};
