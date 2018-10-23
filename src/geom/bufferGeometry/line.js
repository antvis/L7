import { DataType, DrawMode } from '@ali/r3-base';
import { BufferGeometry } from '@ali/r3-geometry';

export class meshLineGeometry extends BufferGeometry {
  constructor(opts) {
    super();
    this._verts = opts.verts;
    this._style = opts.style;
    this._indexs = opts.indexs;
    this._initialize();
  }

  _initialize() {
    const self = this;
    super.initialize([
      { semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false },
      { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false }
    ], self._verts.length);

    self.mode = DrawMode.TRIANGLES;
    for (let i = 0; i < self._verts.length; i++) {
      const index = self._indexs[i];
      const color = this._style[index].color;
      const values = {
        POSITION: self._verts[i],
        COLOR: color
      };
      self.setVertexValues(i, values);
    }
  }
}


export class arcGeometry extends BufferGeometry {
  constructor(opts) {
    super();
    // 顶点位置数据
    this._verts = opts.verts;
    this._style = opts.style;
    this._indexs = opts.indexs;
    this._instances = opts.instances;
    this._initialize();
  }

  _initialize() {
    const self = this;
    super.initialize([
      { semantic: 'POSITION', size: 3, type: DataType.FLOAT, normalized: false },
      { semantic: 'COLOR', size: 4, type: DataType.FLOAT, normalized: false },
      { semantic: 'INSPOS', size: 4, type: DataType.FLOAT, normalized: false }
    ], self._verts.length);

    self.mode = DrawMode.LINES;
    for (let i = 0; i < self._verts.length; i++) {
      const index = this._indexs[i];
      const color = this._style[index].color;
      const values = {
        POSITION: self._verts[i],
        COLOR: color,
        INSPOS: self._instances[i]
      };
      self.setVertexValues(i, values);
    }
  }
}

