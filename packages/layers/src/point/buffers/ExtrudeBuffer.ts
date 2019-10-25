// import BaseBuffer, {
//   IBufferInfo,
//   IEncodeFeature,
//   Position,
// } from '../../core/BaseBuffer';
// import extrudePolygon, { IExtrudeGeomety } from '../shape/extrude';
// import { geometryShape, ShapeType2D, ShapeType3D } from '../shape/Path';
// interface IGeometryCache {
//   [key: string]: IExtrudeGeomety;
// }
// export default class ExtrudeBuffer extends BaseBuffer {
//   private indexOffset: number = 0;
//   private verticesOffset: number = 0;
//   private geometryCache: IGeometryCache;
//   public buildFeatures() {
//     const layerData = this.data as IEncodeFeature[];
//     layerData.forEach((feature: IEncodeFeature) => {
//       this.calculateFill(feature);
//     });
//   }

//   protected calculateFeatures() {
//     const layerData = this.data as IEncodeFeature[];
//     this.geometryCache = {};
//     this.verticesOffset = 0;
//     this.indexOffset = 0;
//     layerData.forEach((feature: IEncodeFeature) => {
//       const { shape } = feature;
//       const { positions, index } = this.getGeometry(shape as ShapeType3D);
//       this.verticesCount += positions.length / 3;
//       this.indexCount += index.length;
//     });
//   }
//   protected initAttributes() {
//     super.initAttributes();
//     this.attributes.miters = new Float32Array(this.verticesCount * 3);
//     this.attributes.normals = new Float32Array(this.verticesCount * 3);
//     this.attributes.sizes = new Float32Array(this.verticesCount * 3);
//   }
//   private calculateFill(feature: IEncodeFeature) {
//     const { coordinates, shape } = feature;
//     const instanceGeometry = this.getGeometry(shape as ShapeType3D);
//     const numPoint = instanceGeometry.positions.length / 3;
//     feature.bufferInfo = {
//       verticesOffset: this.verticesOffset,
//       indexOffset: this.indexOffset,
//       dimensions: 3,
//     };
//     this.encodeArray(feature, numPoint);
//     this.attributes.miters.set(
//       instanceGeometry.positions,
//       this.verticesOffset * 3,
//     );
//     const indexArray = instanceGeometry.index.map((v) => {
//       return v + this.verticesOffset;
//     });
//     this.indexArray.set(indexArray, this.indexOffset);
//     const position: number[] = [];
//     for (let i = 0; i < numPoint; i++) {
//       const coor = coordinates as Position;
//       position.push(coor[0], coor[1], coor[2] || 0);
//     }
//     this.attributes.positions.set(position, this.verticesOffset * 3);
//     this.verticesOffset += numPoint;
//     this.indexOffset += indexArray.length;
//   }

//   private getGeometry(shape: ShapeType3D): IExtrudeGeomety {
//     if (this.geometryCache && this.geometryCache[shape]) {
//       return this.geometryCache[shape];
//     }
//     const path = geometryShape[shape]
//       ? geometryShape[shape]()
//       : geometryShape.cylinder();
//     const geometry = extrudePolygon([path]);
//     this.geometryCache[shape] = geometry;
//     return geometry;
//   }
// }
