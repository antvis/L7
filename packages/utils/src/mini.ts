// 检测环境 - 适配支付宝小程序
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';
