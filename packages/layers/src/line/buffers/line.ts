import BufferBase, { IEncodeFeature, Position } from '../../core/BaseBuffer';
interface IBufferInfo {
  normals: number[];
  arrayIndex: number[];
  positions: number[];
  attrDistance: number[];
  miters: number[];
  verticesOffset: number;
  indexOffset: number;
}
export default class FillBuffer extends BufferBase {
  private hasPattern: boolean;
  protected buildFeatures() {
    const layerData = this.data as IEncodeFeature[];
    layerData.forEach((feature: IEncodeFeature) => {
      this.calculateLine(feature);
      delete feature.bufferInfo;
    });
    this.hasPattern = layerData.some((feature: IEncodeFeature) => {
      return feature.pattern;
    });
  }
  protected initAttributes() {
    super.initAttributes();
    this.attributes.dashArray = new Float32Array(this.verticesCount);
    this.attributes.attrDistance = new Float32Array(this.verticesCount);
    this.attributes.totalDistances = new Float32Array(this.verticesCount);
    this.attributes.patterns = new Float32Array(this.verticesCount * 2);
    this.attributes.miters = new Float32Array(this.verticesCount);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
  }
  protected calculateFeatures() {
    const layerData = this.data as IEncodeFeature[];
    // 计算长
    layerData.forEach((feature: IEncodeFeature) => {
      let { coordinates } = feature;
      if (Array.isArray(coordinates[0][0])) {
        coordinates = coordinates[0];
      }
      const { normals, attrIndex, attrPos, attrDistance, miters } = getNormals(
        coordinates,
        false,
        this.verticesCount,
      );
      const bufferInfo: IBufferInfo = {
        normals,
        arrayIndex: attrIndex,
        positions: attrPos,
        attrDistance,
        miters,
        verticesOffset: this.verticesCount,
        indexOffset: this.indexCount,
      };
      this.verticesCount += attrPos.length / 3;
      this.indexCount += attrIndex.length;
      feature.bufferInfo = bufferInfo;
    });
  }
  private calculateLine(feature: IEncodeFeature) {
    const bufferInfo = feature.bufferInfo as IBufferInfo;
    const {
      normals,
      arrayIndex,
      positions,
      attrDistance,
      miters,
      verticesOffset,
      indexOffset,
    } = bufferInfo;
    const { dashArray = 200 } = this.style;

    this.encodeArray(feature, positions.length / 3);
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
