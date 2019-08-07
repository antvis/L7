/*
 * @Author: ThinkGIS
 * @Date: 2018-06-14 20:13:18
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-08 15:46:28
 */

import Base from './base';

/**
 * 视觉通道 filter
 * @class Attr.filter
 */
class Filter extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'filter' ];
    this.type = 'filter';
    this.gradient = null;
  }
}
export default Filter;
