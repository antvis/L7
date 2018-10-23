import { DataType, DrawMode } from '@ali/r3-base';
import BaseBufferGeometry from './baseBufferGeometry';
/**
 * 创建Polygon几何体
 */
export default class TextGeometry extends BaseBufferGeometry {

  constructor(opts) {
    opts.DrawMode = opts.drawMode || 'TRIANGLES';

    super(opts);


  }

  /**
   * 构造多边形数据
   * @private
   */
  initialize() {
    super.initialize([
      { semantic: 'POSITION', size: 4, type: DataType.FLOAT, normalized: false },
      { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false },
      { semantic: 'TEXCOORD_0', size: 2, type: DataType.FLOAT, normalized: false },
      { semantic: 'SIZE', size: 1, type: DataType.FLOAT, normalized: false }
    ], this._indexCount);
    let dataIndex = 0;
    this._position.forEach((pos, i) => {
      const color = this._style[i].color;
      const uv = this._uv[i];
      pos.forEach((p, j) => {
        this.setVertexValues(dataIndex++, {
          POSITION: p,
          COLOR: color,
          SIZE: [ this._style[i].size ],
          TEXCOORD_0: uv[j]
        });
      });
    });
  }
}
