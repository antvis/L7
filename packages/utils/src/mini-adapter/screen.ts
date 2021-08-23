// @ts-nocheck
import { isMini } from './index';
let screenWidth;
let screenHeight;
let windowWidth;
let windowHeight;
if (isMini) {
  const myOptions = my.getSystemInfoSync();
  screenWidth = myOptions.screenWidth;
  screenHeight = myOptions.screenHeight;
  windowWidth = myOptions.windowWidth;
  windowHeight = myOptions.windowHeight;
} else {
  const { innerWidth, innerHeight } = window;
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
