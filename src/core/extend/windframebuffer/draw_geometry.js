import { DataType, DrawMode } from '@ali/r3-base';
import { BufferGeometry } from '@ali/r3-geometry';

/**
 * 创建点图层几何体
 */
export default class DrawGeometry extends BufferGeometry {

  constructor(opts) {
    super(opts.name);
    this._index = opts.index;
    this.mode = DrawMode.POINTS;

    this.primitive.indexType = DataType.UNSIGNED_INT;
    this.initialize();
  }

  /**
   * 构造多边形数据
   * @private
   */
  initialize() {
    super.initialize([
        { semantic: 'INDEX', size: 1, type: DataType.FLOAT, normalized: false }
    ], this._index.length);

    this._index.forEach((vert, j) => {
      this.setVertexValues(j, {
        INDEX: [ vert ]
      });
    });
  }

}
