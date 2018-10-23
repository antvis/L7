import { BufferGeometry, Float32BufferAttribute } from '../../core/three';
/**
 * 基础几何体
 */
export default class BaseBufferGeometry extends BufferGeometry {

// indices, position, uv, normal
  constructor(opts) {
    super(opts.name);
    // 几何体顶点位置数据
    this._opts = opts;
    this._position = opts.position;

    // 三角形顶点序号数据
    this._indices = opts.indices;

    // this._colors = opts.colors;

    this._style = opts.style;


    // 法线数据
    this._normals = opts.normals;

    this._uv = opts.uv;


    this._activeIds = null;
    this._textIndex = opts.textIndex;
    this._indexCount = opts.indexCount;
    if (opts.DrawMode) {
      this.mode = DrawMode[opts.DrawMode];
    }
    if (this._indexCount > 65536) {
      this.primitive.indexType = DataType.UNSIGNED_INT;
    }
    this.initialize();
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
    if (!this._indices) {
      const color = style.color;
      this.setVertexValues(id, {
        COLOR: color
      });
      return;
    }
    for (let i = 0; i < id; i++) {
      dataIndex += this._indices[i].length;
    }
    featureStyleId.forEach(index => {

      const indices = this._indices[index];
      const color = style.color;
      indices.forEach(() => {
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
    let dataIndex = 0;

    this._indices.forEach((indices, i) => {
      const color = [ ...this._style[i].color ];
      if (filterData[i].hasOwnProperty('filter') && filterData[i].filter === false) {
        color[3] = 0;
      }

      indices.forEach(() => {
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
    if (!this._indices) {
      const color = this._style[id].color;
      this.setVertexValues(id, {
        COLOR: color
      });
      return;
    }
    for (let i = 0; i < id; i++) {
      dataIndex += this._indices[i].length;
    }
    this._activeIds.forEach(index => {
      const indices = this._indices[index];
      indices.forEach(() => {
        this.setVertexValues(dataIndex++, {
          COLOR: this._style[index].color
        });
      });
    });
  }
}
