// 检测环境 - 适配支付宝小程序
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';

function getWindow() {
  if (isMiniAli) {
    return aliMiniWindow;
  } else if (window) {
    return window;
  } else {
    return fakeWindow;
  }
}

const l7window = getWindow();

const fakeWindow = {
  devicePixelRatio: 1,
};

const aliMiniWindow = {
  devicePixelRatio: 1,
};
