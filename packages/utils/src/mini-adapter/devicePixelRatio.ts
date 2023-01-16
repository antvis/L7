// @ts-nocheck 判断时候是支付宝小程序环境 （ my.isFRM == true smallfish H5+ ）
import { globalWindow } from './global';

export default globalWindow.devicePixelRatio;
