/*
 * @Author: ThinkGIS
 * @Date: 2018-06-14 20:13:18
 * @Last Modified by: ThinkGIS
 * @Last Modified time: 2018-07-02 18:24:58
 */

const Base = require('./base');

/**
 * 视觉通道 symbol
 * @class Attr.symbol
 */
class Symbol extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'symbol' ];
    this.type = 'symbol';
    this.gradient = null;
  }
}
module.exports = Symbol;
