// 判断时候是支付宝小程序环境
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';

// 判断是否是小程序环境
export const isMini = isMiniAli;
// export const isMini = true
