import { DataType } from '@ali/r3-base';
import BaseBufferGeometry from './baseBufferGeometry';

/**
 * 创建点图层几何体
 */
export default class RainGeometry extends BaseBufferGeometry {

  constructor(opts) {
    opts.DrawMode = 'POINTS';
    super(opts);
  }

  /**
   * 构造多边形数据
   * @private
   */
  initialize() {
    super.initialize([
        { semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false },
        { semantic: 'TEXCOORD_0', size: 2, type: DataType.FLOAT, normalized: false }
    ], this._position.length);

    this._position.forEach((vert, j) => {
      this.setVertexValues(j, {
        POSITION: vert,
        TEXCOORD_0: this._uv[j]
      });
    });
  }

}
