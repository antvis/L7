// @ts-nocheck 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
import { globalWindow } from './global';
export const isMiniAli =
  // @ts-ignore
  typeof my !== 'undefined' &&
  !!my &&
  typeof my.showToast === 'function' &&
  my.isFRM !== true;
let system;
let platform;
let language;
if (isMiniAli) {
  const myOptions = my.getSystemInfoSync();
  system = myOptions.system;
  platform = myOptions.platform;
  language = myOptions.language;
} else {
  const browser = {
    versions: (() => {
      const u = globalWindow.navigator.userAgent;
      return {
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) === ' qq', // 是否QQ
      };
    })(),
    language: (
      globalWindow.navigator.browserLanguage || globalWindow.navigator.language
    ).toLowerCase(),
  };
  if (browser.versions.android) {
    platform = 'android';
  } else if (browser.versions.trident) {
    platform = 'IE';
  } else if (browser.versions.presto) {
    platform = 'Opera';
  } else if (browser.versions.webKit) {
    platform = 'webKit';
  } else if (browser.versions.gecko) {
    platform = 'Firefox';
  } else if (browser.versions.mobile) {
    platform = 'mobile';
  } else if (browser.versions.ios) {
    platform = 'ios';
  } else if (browser.versions.iPhone) {
    platform = 'iPhone';
  } else if (browser.versions.iPad) {
    platform = 'ipad';
  } else if (browser.versions.webApp) {
    platform = 'webApp';
  } else if (browser.versions.weixin) {
    platform = 'weixin';
  } else if (browser.versions.qq) {
    platform = 'qq';
  }
  system = globalWindow.navigator.userAgent;
  language = browser.language;
}

const android = system.toLowerCase().indexOf('android') !== -1;

const uaDesc = android
  ? 'Android; CPU Android 6.0'
  : 'iPhone; CPU iPhone OS 10_3_1 like Mac OS X';
const ua = `Mozilla/5.0 (${uaDesc}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/${language}`;

export const navigator = {
  platform,
  language,
  appVersion: `5.0 (${uaDesc}) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`,
  userAgent: ua,
};
