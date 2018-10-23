/*
 * @Author: ThinkGIS
 * @Date: 2018-06-14 20:13:18
 * @Last Modified by: ThinkGIS
 * @Last Modified time: 2018-07-15 17:26:40
 */

const Base = require('./base');

/**
 * 视觉通道 symbol
 * @class Attr.symbol
 */
class Filter extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'filter' ];
    this.type = 'filter';
    this.gradient = null;
  }
}
module.exports = Filter;
