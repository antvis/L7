// @ts-nocheck
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';
export default !isMiniAli
  ? devicePixelRatio
  : (my.getSystemInfoSync().pixelRatio as number);
