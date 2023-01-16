// @ts-nocheck 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
import { globalWindow } from './global';
// 判断时候是支付宝小程序环境
let screenWidth;
let screenHeight;
let windowWidth;
let windowHeight;
const { innerWidth, innerHeight } = globalWindow;
screenWidth = innerWidth;
screenHeight = innerHeight;
windowWidth = innerWidth;
windowHeight = innerHeight;

export const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: windowWidth,
  availHeight: windowHeight,
  availLeft: 0,
  availTop: 0,
};
