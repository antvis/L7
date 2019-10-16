import BufferBase, { IEncodeFeature, Position } from '../../core/BaseBuffer';
import extrudePolygon, {
  fillPolygon,
  IExtrudeGeomety,
} from '../../point/shape/extrude';
import {
  geometryShape,
  ShapeType2D,
  ShapeType3D,
} from '../../point/shape/Path';
export default class GridHeatMapBuffer extends BufferBase {
  private verticesOffset: number = 0;
  protected buildFeatures() {
    this.verticesOffset = 0;
    const layerData = this.data as IEncodeFeature[];
    layerData.forEach((feature: IEncodeFeature) => {
      this.calculateFill(feature);
    });
  }
  protected calculateFeatures() {
    const layerData = this.data as IEncodeFeature[];
    const shape = layerData[0].shape as ShapeType3D | ShapeType2D;
    this.verticesCount = layerData.length;
    this.indexCount = 0;
    this.instanceGeometry = this.getGeometry(shape as
      | ShapeType2D
      | ShapeType3D);
  }
  protected calculateFill(feature: IEncodeFeature) {
    feature.bufferInfo = { verticesOffset: this.verticesOffset };
    const coordinates = feature.coordinates as Position;
    this.encodeArray(feature, 1);
    this.attributes.positions.set([...coordinates, 1], this.verticesOffset * 3);
    this.verticesOffset++;
  }
  private getGeometry(shape: ShapeType2D | ShapeType3D): IExtrudeGeomety {
    const path = geometryShape[shape]
      ? geometryShape[shape]()
      : geometryShape.circle();
    // const geometry = ShapeType2D[str as ShapeType2D]
    //   ? fillPolygon([path])
    //   : extrudePolygon([path]);
    const geometry = fillPolygon([path]);
    return geometry;
  }
}
