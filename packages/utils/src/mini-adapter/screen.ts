// @ts-nocheck
// tslint:disable
declare let my: any;
const {
  screenWidth,
  screenHeight,
  windowWidth,
  windowHeight,
} = my.getSystemInfoSync();
export const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: windowWidth,
  availHeight: windowHeight,
  availLeft: 0,
  availTop: 0,
};
