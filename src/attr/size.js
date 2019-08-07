/**
 * @fileOverview the size attribute of core
 * @author huangtonger@aliyun.com
 */

import Base from './base';
import Util from '../util';

/**
 * 视觉通道 size
 * @class Attr.Size
 */
class Size extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'size' ];
    this.type = 'size';
    this.gradient = null;
    this.domainIndex = 0;
  }

  mapping() {
    // 重构
    const self = this;
    const outputs = [];
    const scales = self.scales;
    if (self.values.length === 0) {
      const callback = this.callback.bind(this);
      outputs.push(callback(...arguments));
    } else {
      if (!Util.isArray(self.values[0])) {
        self.values = [ self.values ];
      }
      for (let i = 0; i < scales.length; i++) {
        outputs.push(self._scaling(scales[i], arguments[i]));
      }
    }
    this.domainIndex = 0;
    return outputs;
  }

  _scaling(scale, v) {
    if (scale.type === 'identity') {
      return v;
    }
    const percent = scale.scale(v);
    return this.getLinearValue(percent);

    // else if (scale.type === 'linear') {
  }

  getLinearValue(percent) {
    const values = this.values[this.domainIndex];
    const steps = values.length - 1;
    const step = Math.floor(steps * percent);
    const leftPercent = steps * percent - step;
    const start = values[step];
    const end = step === steps ? start : values[step + 1];
    const rstValue = start + (end - start) * leftPercent;
    this.domainIndex += 1;
    return rstValue;
  }

}

export default Size;
