import BufferBase from '../buffer';
import earcut from 'earcut';
export default class FillBuffer extends BufferBase {

  _buildFeatures() {
    const layerData = this.get('layerData');
    layerData.forEach(feature => {
      this._calculateFill(feature);
      delete feature.bufferInfo;
    });
  }

  _calculateFill(feature) {
    const { indexArray, vertices, indexOffset, verticesOffset } = feature.bufferInfo;
    const pointCount = vertices.length / 3;
    this._encodeArray(feature, vertices.length / 3);
    // 添加顶点
    for (let i = 0; i < pointCount; i++) {
      this.attributes.positions.set([ vertices[ i * 3 ], vertices[i * 3 + 1 ], 0 ], (verticesOffset + i) * 3);
      if (this.get('uv')) {
        // TODO 用过BBox计算纹理坐标
        this.attributes.uv.set([ 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0 ], (verticesOffset + i) * 3);
      }
    }
    feature.bufferInfo.verticesOffset += pointCount;
    // 添加顶点索引
    this.indexArray.set(indexArray, indexOffset); // 顶部坐标
    feature.bufferInfo.indexOffset += indexArray.length;
  }

  _calculateFeatures() {
    const layerData = this.get('layerData');
    // 计算长
    layerData.forEach(feature => {
      const { coordinates } = feature;
      const bufferInfo = {};
      const flattengeo = earcut.flatten(coordinates);
      const { vertices, dimensions, holes } = flattengeo;
      const indexArray = earcut(vertices, holes, dimensions).map(v => { return this.verticesCount + v; });
      bufferInfo.vertices = vertices;
      bufferInfo.indexArray = indexArray;
      bufferInfo.verticesOffset = this.verticesCount + 0;
      bufferInfo.indexOffset = this.indexCount + 0;
      this.indexCount += indexArray.length;
      this.verticesCount += vertices.length / 3;
      feature.bufferInfo = bufferInfo;

    });
  }
}

