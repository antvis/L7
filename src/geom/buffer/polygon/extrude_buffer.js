import BufferBase from '../buffer';
import earcut from 'earcut';
export default class ExtrudeButffer extends BufferBase {

  _buildFeatures() {
    const layerData = this.get('layerData');
    layerData.forEach(feature => {
      this._calculateTop(feature);
      this._calculateWall(feature);
      delete feature.bufferInfo;
    });
  }

  _calculateFeatures() {
    const layerData = this.get('layerData');
    // 计算长
    layerData.forEach(feature => {
      const { coordinates } = feature;
      const bufferInfo = {};
      const flattengeo = earcut.flatten(coordinates);
      const n = this.checkIsClosed(coordinates[0]) ? coordinates[0].length - 1 : coordinates[0].length;
      const { vertices, dimensions, holes } = flattengeo;
      const indexArray = earcut(vertices, holes, dimensions).map(v => { return this.verticesCount + v; });
      bufferInfo.vertices = vertices;
      bufferInfo.indexArray = indexArray;
      bufferInfo.verticesOffset = this.verticesCount + 0;
      bufferInfo.indexOffset = this.indexCount + 0;
      bufferInfo.faceNum = n;
      this.indexCount += indexArray.length + n * 6;
      this.verticesCount += vertices.length / 3 + n * 4;
      feature.bufferInfo = bufferInfo;

    });
  }
  _calculateTop(feature) {
    const size = feature.size;
    const { indexArray, vertices, indexOffset, verticesOffset } = feature.bufferInfo;
    const pointCount = vertices.length / 3;
    this._encodeArray(feature, vertices.length / 3);
    // 添加顶点
    for (let i = 0; i < pointCount; i++) {
      this.attributes.positions.set([ vertices[ i * 3 ], vertices[i * 3 + 1 ], size ], (verticesOffset + i) * 3);
      // 顶部文理坐标计算
      if (this.get('uv')) {
        // TODO 用过BBox计算纹理坐标
        this.attributes.uv.set([ -1, -1 ], (verticesOffset + i) * 2);
      }
    }
    feature.bufferInfo.verticesOffset += pointCount;
    // 添加顶点索引
    this.indexArray.set(indexArray, indexOffset); // 顶部坐标
    feature.bufferInfo.indexOffset += indexArray.length;

  }
}
