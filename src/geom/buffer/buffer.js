import Base from '../../core/base';
export default class BufferBase extends Base {
  constructor(cfg) {
    super(cfg);
    this.attributes = {
    };
    this.verticesCount = 0;
    this.indexCount = 0;
    this.indexArray = new Int32Array(0);
    this._init();
  }
  _init() {
    this._calculateFeatures();
    this._initAttributes();
    this._buildFeatures();
  }
  _initAttributes() {
    this.attributes.positions = new Float32Array(this.verticesCount * 3);
    this.attributes.colors = new Float32Array(this.verticesCount * 4);
    this.attributes.pickingIds = new Float32Array(this.verticesCount);
    this.attributes.sizes = new Float32Array(this.verticesCount);
    this.attributes.pickingIds = new Float32Array(this.verticesCount);
    if (this.get('uv')) {
      this.attributes.uv = new Float32Array(this.verticesCount * 2);
    }
    this.indexArray = new Int32Array(this.indexCount);
  }
  addFeature() {

  }
  // 更新渲染
  upload() {

  }
  destroy() {

  }
  resize() {

  }
  checkIsClosed(points) {
    const p1 = points[0][0];
    const p2 = points[0][points[0].length - 1];
    return (p1[0] === p2[0] && p1[1] === p2[1]);
  }
  concat(arrayType, arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
      totalLength += arr.length;
    }
    const arrayBuffer = new ArrayBuffer(totalLength * arrayType.BYTES_PER_ELEMENT);
    let offset = 0;
    const result = new arrayType(arrayBuffer);
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  _encodeArray(feature, num) {
    const { color, id, pattern, size } = feature;
    const { verticesOffset } = feature.bufferInfo;
    const imagePos = this.get('imagePos');
    const start1 = verticesOffset;
    for (let i = 0; i < num; i++) {
      if (feature.hasOwnProperty('color')) {
        this.attributes.colors[start1 * 4 + i * 4] = color[0];
        this.attributes.colors[start1 * 4 + i * 4 + 1] = color[1];
        this.attributes.colors[start1 * 4 + i * 4 + 2] = color[2];
        this.attributes.colors[start1 * 4 + i * 4 + 3] = color[3];

      }
      if (feature.hasOwnProperty('id')) {
        this.attributes.pickingIds[start1 + i] = id;
      }
      if (feature.hasOwnProperty('size')) {
        let size2 = size;
        if (Array.isArray(size) && size.length === 2) {
          size2 = [ size[0] ];
        }
        if (!Array.isArray(size)) {
          size2 = [ size ];
        }
        this.attributes.sizes.set(size2, (start1 + i) * size2.length);
      }
      if (feature.hasOwnProperty('pattern')) {

        const patternPos = imagePos[pattern] || { x: 0, y: 0 };
        this.attributes.patterns[start1 * 2 + i * 2 ] = patternPos.x;
        this.attributes.patterns[start1 * 2 + i * 2 + 1] = patternPos.y;
      }
    }

  }
  _calculateWall(feature) {
    const size = feature.size;
    const { vertices, indexOffset, verticesOffset, faceNum } = feature.bufferInfo;
    this._encodeArray(feature, faceNum * 4);
    for (let i = 0; i < faceNum; i++) {
      const prePoint = vertices.slice(i * 3, i * 3 + 3);
      const nextPoint = vertices.slice(i * 3 + 3, i * 3 + 6);
      this._calculateExtrudeFace(prePoint, nextPoint, verticesOffset + i * 4, indexOffset + i * 6, size);
      feature.bufferInfo.verticesOffset += 4;
      feature.bufferInfo.indexOffset += 6;
    }
  }

  _calculateExtrudeFace(prePoint, nextPoint, positionOffset, indexOffset, size) {
    this.attributes.positions.set([
      prePoint[0], prePoint[1], size,
      nextPoint[0], nextPoint[1], size,
      prePoint[0], prePoint[1], 0,
      nextPoint[0], nextPoint[1], 0
    ],
    positionOffset * 3);
    const indexArray = [ 1, 2, 0, 3, 2, 1 ].map(v => { return v + positionOffset; });
    if (this.get('uv')) {
      this.attributes.uv.set([ 0.1, 0, 0, 0, 0.1, size / 2000, 0, size / 2000 ], positionOffset * 2);
    }
    this.indexArray.set(indexArray, indexOffset);
  }


}
