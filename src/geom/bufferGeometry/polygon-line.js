import { DataType, DrawMode } from '@ali/r3-base';
import { IndexBufferGeometry } from '@ali/r3-geometry';

// 创建立方体
export default class PolygonLine extends IndexBufferGeometry {
  constructor(opts) {
    super();
    this._positions = opts.verts;
    this._positionsIndexs = opts.indexs;
    this._vertsCount = opts.vertsCount;
    this._style = opts.style;
    //
    if (this._positionsIndexs.length > 65536) {
      this.primitive.indexType = DataType.UNSIGNED_INT;
    }
    this.initialize();
  }
  initialize() {
    super.initialize([
      { semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false },
      { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false }
    ], this._vertsCount, this._positionsIndexs);
    this.mode = DrawMode.LINES;
    const featureCount = this._positions.length;
    let indexCount = 0;
    for (let i = 0; i < featureCount; i++) {
      const pos = this._positions[i];
      for (let j = 0; j < pos.length; j++) {
        this.setVertexValues(indexCount, {
          POSITION: pos[j],
          COLOR: this._style[i].color
        });
        indexCount++;
      }
    }
  }
  updateFilter(filterData) {
    this._activeIds = null; // 清空选中元素
    const featureCount = this._positions.length;
    let indexCount = 0;
    for (let i = 0; i < featureCount; i++) {
      const pos = this._positions[i];
      const color = [ ...this._style[i].color ];
      if (filterData[i].hasOwnProperty('filter') && filterData[i].filter === false) {
        color[3] = 0;
      }
      for (let j = 0; j < pos.length; j++) {
        this.setVertexValues(indexCount, {
          COLOR: color
        });
        indexCount++;
      }
    }

  }
}
