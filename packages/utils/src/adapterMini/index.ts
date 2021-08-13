import aliDocument from './aliDocument';
import aliPerformance from './aliPerformance';
// 判断时候是支付宝小程序环境
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' && !!my && typeof my.showToast === 'function';

// ali mini dpr
const aliDPR = isMiniAli
  ? // @ts-ignore
    my?.getSystemInfoSync()?.devicePixelRatio || 1
  : 1;

// 判断是否是小程序环境
export const isMini = isMiniAli;

const aliMiniWin = {
  addEventListener: (
    type: string,
    fn: (e: any) => any,
    bubbing: boolean,
  ): any => {
    return '';
  },
  removeEventListener: (
    type: string,
    fu: (e: any) => any,
    bubbing: boolean,
  ): any => {
    return '';
  },
  navigator: {
    platform: 'aliMini',
  },
  InstallTrigger: undefined,
  document: aliDocument,
  performance: aliPerformance,
  devicePixelRatio: aliDPR,
  matchMedia: undefined,
};

export const l7window = isMiniAli ? aliMiniWin : window;
