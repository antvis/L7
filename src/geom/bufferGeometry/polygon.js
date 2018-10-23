import { DataType, DrawMode } from '@ali/r3-base';
import { BufferGeometry } from '@ali/r3-geometry';
/**
 * 创建Polygon几何体
 */
export default class PolygonGeometry extends BufferGeometry {

  constructor(opts) {
    super(opts.name);

    // 几何体顶点位置数据
    this._verts = opts.position;

    // 三角形顶点序号数据
    this._indexs = opts.indices;


    this._style = opts.style;


    // 法线数据
    this._normals = opts.normals;

    this._indexCount = opts.indexCount;
    this._activeIds = null;

    this.initialize();
  }

  /**
   * 构造多边形数据
   * @private
   */
  initialize() {
    super.initialize([
      { semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false },
      { semantic: 'NORMAL', size: 3, type: DataType.FLOAT, normalized: true },
      { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false },
      { semantic: 'IDCOLOR', size: 4, type: DataType.FLOAT, normalized: false }
    ], this._indexCount);
    this.mode = DrawMode.TRIANGLES;
    if (this._indexCount > 65536) {
      this.primitive.indexType = DataType.UNSIGNED_INT;
    }
    // camera.renderHardware
    let dataIndex = 0;
    this._indexs.forEach((vertIndexs, i) => {
      const color = [ ...this._style[i].color ];
      if (this._style[i].hasOwnProperty('filter') && !this._style[i].filter) {
        color[3] = 0;
      }
      vertIndexs.forEach((index, j) => {
        const vert = this._verts[i][index];
        const normalIndex = Math.floor(j / 3);
        this.setVertexValues(dataIndex++, {
          POSITION: vert,
          COLOR: color,
          IDCOLOR: this._style[i].id,
          NORMAL: this._normals[i][normalIndex]
        });
      });
    });
  }
  /**
   * 更新active操作
   * @param {*} featureStyleId 需要更新的要素Id
   * @param {*} style  更新的要素样式
   */
  updateStyle(featureStyleId, style) {
    if (this._activeIds) {
      this.resetStyle();
    }
    this._activeIds = featureStyleId;
    let dataIndex = 0;
    const id = featureStyleId[0];
    for (let i = 0; i < id; i++) {
      dataIndex += this._indexs[i].length;
    }
    featureStyleId.forEach(index => {
      const vertindex = this._indexs[index];
      const color = style.color;
      vertindex.forEach(() => {
        this.setVertexValues(dataIndex++, {
          COLOR: color
        });
      });
    });

  }
   /**
   * 用于过滤数据
   * @param {*} filterData  数据过滤标识符
   */
  updateFilter(filterData) {
    this._activeIds = null; // 清空选中元素
    let dataIndex = 0;
    this._indexs.forEach((vertIndexs, i) => {
      const color = [ ...this._style[i].color ];
      if (filterData[i].hasOwnProperty('filter') && filterData[i].filter === false) {
        color[3] = 0;
      }

      vertIndexs.forEach(() => {
        this.setVertexValues(dataIndex++, {
          COLOR: color
        });
      });
    });
  }
  /**
   * 重置高亮要素
   */
  resetStyle() {
    let dataIndex = 0;
    const id = this._activeIds[0];
    for (let i = 0; i < id; i++) {
      dataIndex += this._indexs[i].length;
    }
    this._activeIds.forEach(index => {
      const vertindex = this._indexs[index];
      vertindex.forEach(() => {
        this.setVertexValues(dataIndex++, {
          COLOR: this._style[index].color
        });
      });
    });
  }
}
