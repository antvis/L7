/**
 * @fileOverview the shape attribute of core
 * @author huangtonger@aliyun.com
 */


import Base from './base';

/**
 * 视觉通道 Shape
 * @class Attr.Shape
 */
class Shape extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'shape' ];
    this.type = 'shape';
    this.gradient = null;
  }

  /**
   * @override
   */
  getLinearValue(percent) {
    const values = this.values;
    const index = Math.round((values.length - 1) * percent);
    return values[index];
  }
  /**
   * @override
   */
  _getAttrValue(scale, value) {
    if (this.values === 'text') { return value; }
    const values = this.values;
    if (scale.isCategory && !this.linear) {
      const index = scale.translate(value);
      return values[index % values.length];
    }
    const percent = scale.scale(value);
    return this.getLinearValue(percent);
  }
}

export default Shape;
