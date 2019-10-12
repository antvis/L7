import earcut from 'earcut';
import BufferBase, {
  IBufferInfo,
  IEncodeFeature,
  Position,
} from '../../core/BaseBuffer';
export default class ExtrudeBuffer extends BufferBase {
  public buildFeatures() {
    const layerData = this.data as IEncodeFeature[];
    layerData.forEach((feature: IEncodeFeature) => {
      this.calculateTop(feature);
      this.calculateWall(feature);
      delete feature.bufferInfo;
    });
  }

  public calculateFeatures() {
    const layerData = this.data as IEncodeFeature[];
    // 计算长
    layerData.forEach((feature: IEncodeFeature) => {
      const coordinates = feature.coordinates as Position[][];
      const flattengeo = earcut.flatten(coordinates);
      const n = this.checkIsClosed(coordinates)
        ? coordinates[0].length - 1
        : coordinates[0].length;
      const { vertices, dimensions, holes } = flattengeo;
      const indexArray = earcut(vertices, holes, dimensions).map(
        (v) => this.verticesCount + v,
      );
      const bufferInfo: IBufferInfo = {
        dimensions,
        vertices,
        indexArray,
        verticesOffset: this.verticesCount + 0,
        indexOffset: this.indexCount + 0,
        faceNum: n,
      };
      this.indexCount += indexArray.length + n * 6;
      this.verticesCount += vertices.length / dimensions + n * 4;
      feature.bufferInfo = bufferInfo;
    });
  }
  protected calculateWall(feature: IEncodeFeature) {
    const size = feature.size || 0;
    const bufferInfo = feature.bufferInfo as IBufferInfo;
    const {
      vertices,
      indexOffset,
      verticesOffset,
      faceNum,
      dimensions,
    } = bufferInfo;
    this.encodeArray(feature, faceNum * 4);
    for (let i = 0; i < faceNum; i++) {
      const prePoint = vertices.slice(i * dimensions, (i + 1) * dimensions);
      const nextPoint = vertices.slice(
        (i + 1) * dimensions,
        (i + 2) * dimensions,
      );
      this.calculateExtrudeFace(
        prePoint,
        nextPoint,
        verticesOffset + i * 4,
        indexOffset + i * 6,
        size as number,
      );
      bufferInfo.verticesOffset += 4;
      bufferInfo.indexOffset += 6;
      feature.bufferInfo = bufferInfo;
    }
  }
  private calculateTop(feature: IEncodeFeature) {
    const size = feature.size || 1;
    const bufferInfo = feature.bufferInfo as IBufferInfo;
    const {
      indexArray,
      vertices,
      indexOffset,
      verticesOffset,
      dimensions,
    } = bufferInfo;
    const pointCount = vertices.length / dimensions;
    this.encodeArray(feature, vertices.length / dimensions);
    // 添加顶点
    for (let i = 0; i < pointCount; i++) {
      this.attributes.positions.set(
        [vertices[i * dimensions], vertices[i * dimensions + 1], size],
        (verticesOffset + i) * 3,
      );
      // 顶部文理坐标计算
      // if (this.uv) {
      //   // TODO 用过BBox计算纹理坐标
      //   this.attributes.uv.set([-1, -1], (verticesOffset + i) * 2);
      // }
    }
    bufferInfo.verticesOffset += pointCount;
    // 添加顶点索引
    this.indexArray.set(indexArray, indexOffset); // 顶部坐标
    bufferInfo.indexOffset += indexArray.length;
    feature.bufferInfo = bufferInfo;
  }
  private calculateExtrudeFace(
    prePoint: number[],
    nextPoint: number[],
    positionOffset: number,
    indexOffset: number | undefined,
    size: number,
  ) {
    this.attributes.positions.set(
      [
        prePoint[0],
        prePoint[1],
        size,
        nextPoint[0],
        nextPoint[1],
        size,
        prePoint[0],
        prePoint[1],
        0,
        nextPoint[0],
        nextPoint[1],
        0,
      ],
      positionOffset * 3,
    );
    const indexArray = [1, 2, 0, 3, 2, 1].map((v) => {
      return v + positionOffset;
    });
    // if (this.uv) {
    //   this.attributes.uv.set(
    //     [0.1, 0, 0, 0, 0.1, size / 2000, 0, size / 2000],
    //     positionOffset * 2,
    //   );
    // }
    this.indexArray.set(indexArray, indexOffset);
  }
}
