
import Base from './base';

/**
 * 视觉通道 pattern
 * @class Attr.pattern
 */
class Pattern extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'pattern' ];
    this.type = 'pattern';
    this.gradient = null;
  }
}
export default Pattern;
