// 判断时候是支付宝小程序环境
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';
// export const isMiniAli = true

// 判断是否是小程序环境
export const isMini = isMiniAli;
// export const isMini = true

const aliMiniWin = {
  devicePixelRatio: isMiniAli
    ? // @ts-ignore
      my?.getSystemInfoSync()?.devicePixelRatio || 1
    : 1,
}

export const l7window = isMiniAli ? aliMiniWin : window;
