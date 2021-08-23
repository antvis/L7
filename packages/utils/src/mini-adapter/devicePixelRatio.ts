// @ts-nocheck
import { isMini } from './index';
export default !isMini
  ? devicePixelRatio
  : (my.getSystemInfoSync().pixelRatio as number);
