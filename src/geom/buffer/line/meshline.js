import BufferBase from '../buffer';
import getNormals from '../../../util/polyline-normals';
export default class MeshLineBuffer extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    layerData.forEach(feature => {
      this._calculateLine(feature);
      delete feature.bufferInfo;
    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.dashArray = new Float32Array(this.verticesCount);
    this.attributes.attrDistance = new Float32Array(this.verticesCount);
    this.attributes.totalDistances = new Float32Array(this.verticesCount);
    this.attributes.patterns = new Float32Array(this.verticesCount * 2);
    this.attributes.miters = new Float32Array(this.verticesCount);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
  }
  _calculateFeatures() {
    const layerData = this.get('layerData');

    // 计算长
    layerData.forEach(feature => {
      const bufferInfo = {};
      const { coordinates } = feature;
      const { normals, attrIndex, attrPos, attrDistance, miters } = getNormals(coordinates, false, this.verticesCount);
      bufferInfo.normals = normals;
      bufferInfo.arrayIndex = attrIndex;
      bufferInfo.positions = attrPos;
      bufferInfo.attrDistance = attrDistance;
      bufferInfo.miters = miters;
      bufferInfo.verticesOffset = this.verticesCount;
      bufferInfo.indexOffset = this.indexCount;
      this.verticesCount += attrPos.length / 3;
      this.indexCount += attrIndex.length;
      feature.bufferInfo = bufferInfo;
    });
  }
  _calculateLine(feature) {
    const { normals, arrayIndex, positions, attrDistance, miters, verticesOffset, indexOffset } = feature.bufferInfo;
    const { dashArray = 200 } = this.get('style');

    this._encodeArray(feature, positions.length / 3);
    const totalLength = attrDistance[attrDistance.length - 1];
    // 增加长度
    const totalDistances = Array(positions.length / 3).fill(totalLength);
    // 虚线比例
    const ratio = dashArray / totalLength;
    const dashArrays = Array(positions.length / 3).fill(ratio);
    this.attributes.positions.set(positions, verticesOffset * 3);
    this.indexArray.set(arrayIndex, indexOffset);
    this.attributes.miters.set(miters, verticesOffset);
    this.attributes.normals.set(normals, verticesOffset * 3);
    this.attributes.attrDistance.set(attrDistance, verticesOffset);
    this.attributes.totalDistances.set(totalDistances, verticesOffset);
    this.attributes.dashArray.set(dashArrays, verticesOffset);
  }

}
