import BufferBase from '../buffer';
export default class Grid3D extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    this._offset = 0;
    const shapeType = this.get('shapeType');
    layerData.forEach(feature => {
      this._calculateTop(feature);
      if (shapeType === 'squareColumn') {
        this._calculateWall(feature);
      }
      delete feature.bufferInfo;
    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.miters = new Float32Array(this.verticesCount * 3);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
  }
  _calculateFeatures() {
    const layerData = this.get('layerData');
    const shapeType = this.get('shapeType');
    if (shapeType === 'squareColumn') {
      this.verticesCount = layerData.length * 20;
    } else {
      this.verticesCount = layerData.length * 4;
    }
    this.indexCount = this.verticesCount * 1.5;
  }
  _calculateTop(feature) {
    const [ x, y ] = feature.coordinates;
    let { size } = feature;

    feature.bufferInfo = {
      verticesOffset: this._offset
    };
    const shapeType = this.get('shapeType');
    if (shapeType !== 'squareColumn') {
      size = 0;
    }
    this._encodeArray(feature, 4);
    this.attributes.positions.set([ x, y, size, x, y, size, x, y, size, x, y, size ], this._offset * 3);
    this.attributes.miters.set([ -1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1 ], this._offset * 3);
    this.attributes.normals.set([ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1 ], this._offset * 3); // top normal
    const indexArray = [ 0, 2, 1, 2, 3, 1 ].map(v => { return v + this._offset; });
    this.indexArray.set(indexArray, this._offset * 1.5);
    this._offset += 4;
  }
  _calculateWall(feature) {
    const { size } = feature;
    const [ x, y ] = feature.coordinates;
    const vertices = [ 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1 ];
    feature.bufferInfo = {
      verticesOffset: this._offset
    };
    this._encodeArray(feature, 20);
    // front left, back right
    this.attributes.normals.set([
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // bottom
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // left
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // top
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 // right
    ], this._offset * 3); // top normal

    for (let i = 0; i < 4; i++) {
      this.attributes.positions.set([ x, y, 1, x, y, 1, x, y, 1, x, y, 1 ], this._offset * 3);
      const prePoint = vertices.slice(i * 3, i * 3 + 3);
      const nextPoint = vertices.slice(i * 3 + 3, i * 3 + 6);
      this._calculateExtrudeFace(prePoint, nextPoint, this._offset, this._offset * 1.5, size);
      this._offset += 4;
    }
  }
  _calculateExtrudeFace(prePoint, nextPoint, positionOffset, indexOffset, size) {
    this.attributes.miters.set([
      prePoint[0], prePoint[1], size,
      nextPoint[0], nextPoint[1], size,
      prePoint[0], prePoint[1], 0,
      nextPoint[0], nextPoint[1], 0
    ],
    positionOffset * 3);
    const indexArray = [ 0, 1, 2, 1, 3, 2 ].map(v => { return v + positionOffset; });
    if (this.get('uv')) {
      // temp  点亮城市demo
      this.attributes.uv.set([ 0.1, 0, 0, 0, 0.1, size / 2000, 0, size / 2000 ], positionOffset * 2);
    }
    this.indexArray.set(indexArray, indexOffset);
  }

}
