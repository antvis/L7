// import earcut from 'earcut';
// import BufferBase, { IBufferInfo, IEncodeFeature } from '../../core/buffer';
// export default class ExtrudeButffer extends BufferBase {
//   public _buildFeatures() {
//     const layerData = this.get('data');
//     layerData.forEach((feature: IEncodeFeature) => {
//       this.calculateTop(feature);
//       this.calculateWall(feature);
//       delete feature.bufferInfo;
//     });
//   }

//   public _calculateFeatures() {
//     const layerData = this.get('data');
//     // 计算长
//     layerData.forEach((feature: IEncodeFeature) => {
//       const { coordinates } = feature;
//       const flattengeo = earcut.flatten(coordinates);
//       const n = this.checkIsClosed(coordinates)
//         ? coordinates[0].length - 1
//         : coordinates[0].length;
//       const { vertices, dimensions, holes } = flattengeo;
//       const indexArray = earcut(vertices, holes, dimensions).map(
//         (v) => this.verticesCount + v,
//       );
//       const bufferInfo: IBufferInfo = {
//         dimensions,
//         vertices,
//         indexArray,
//         verticesOffset: this.verticesCount + 0,
//         indexOffset: this.indexCount + 0,
//         faceNum: n,
//       };
//       this.indexCount += indexArray.length + n * 6;
//       this.verticesCount += vertices.length / dimensions + n * 4;
//       feature.bufferInfo = bufferInfo;
//     });
//   }
//   private calculateTop(feature: IEncodeFeature) {
//     const size = feature.size;
//     const {
//       indexArray,
//       vertices,
//       indexOffset,
//       verticesOffset,
//       dimensions,
//     } = feature.bufferInfo;
//     const pointCount = vertices.length / dimensions;
//     this.encodeArray(feature, dimensions);
//     // 添加顶点
//     for (let i = 0; i < pointCount; i++) {
//       this.attributes.positions.set(
//         [vertices[i * 3], vertices[i * 3 + 1], size],
//         (verticesOffset + i) * 3,
//       );
//       // 顶部文理坐标计算
//       if (this.get('uv')) {
//         // TODO 用过BBox计算纹理坐标
//         this.attributes.uv.set([-1, -1], (verticesOffset + i) * 2);
//       }
//     }
//     feature.bufferInfo.verticesOffset += pointCount;
//     // 添加顶点索引
//     this.indexArray.set(indexArray, indexOffset); // 顶部坐标
//   }
// }
