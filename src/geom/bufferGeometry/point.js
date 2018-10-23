import { DataType, BufferUsage } from '@ali/r3-base';
import BaseBufferGeometry from './baseBufferGeometry';

/**
 * 创建点图层几何体
 */
export default class PointGeometry extends BaseBufferGeometry {

  constructor(opts) {
    opts.DrawMode = 'POINTS';
    super(opts);
  }

  /**
   * 构造多边形数据
   * @private
   */
  initialize() {
    const attributesObj = {
      size: { semantic: 'SIZE', size: 1, type: DataType.FLOAT, normalized: false },
      id: { semantic: 'IDCOLOR', size: 4, type: DataType.FLOAT, normalized: false },
      uv: { semantic: 'TEXCOORD_0', size: 2, type: DataType.FLOAT, normalized: false },
      color: { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false },
      shape: { semantic: 'SHAPE', size: 1, type: DataType.FLOAT, normalized: false }
    };

    const keys = Object.keys(this._style[0]);
    const attributes = [{ semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false }];
    if (this._uv) attributes.push(attributesObj.uv);
    keys.forEach(key => { attributes.push(attributesObj[key]); });
    super.initialize(attributes, this._position.length, BufferUsage.DYNAMIC_DRAW);
    this._position.forEach((vert, i) => {
      const color = this._style[i].color;
      const attrData = {
        POSITION: vert,
        COLOR: color,
        SIZE: [ this._style[i].size ],
        IDCOLOR: this._style[i].id,
        SHAPE: [ this._style[i].shape ]
      };
      if (keys.indexOf('shape') !== -1) attrData.SHAPE = [ this._style[i].shape ];
      if (this._uv) attrData.TEXCOORD_0 = this._uv[i];
      this.setVertexValues(i, attrData);

    });
  }
  updateSize(data) {
    const pointCount = this._position.length;
    for (let i = 0; i < pointCount; i++) {
      this.setVertexValues(i, {
        SIZE: [ data[i] ]
      });
    }
  }
}
