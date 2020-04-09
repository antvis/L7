import { ILngLat, Scene } from '@antv/l7';
import { Feature, featureCollection } from '@turf/helpers';
import { unitsType } from '../util/constant';
import { createLine, createPoint } from '../util/create_geometry';
import moveFeatures from '../util/move_featrues';
import { IDrawFeatureOption } from './draw_feature';
import DrawPolygon from './draw_polygon';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawLine extends DrawPolygon {
  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.type = 'line';
  }

  protected getDefaultOptions(): Partial<IDrawFeatureOption> {
    return {
      ...super.getDefaultOptions(),
      title: '绘制线',
    };
  }
  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawLayer.updateData(featureCollection(newFeature));
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    this.currentFeature = newFeature[0];
    this.pointFeatures = newPointFeture;
    return this.currentFeature;
  }
  protected createFeature(points: ILngLat[]): Feature {
    const pointfeatures = createPoint(this.points);
    this.pointFeatures = pointfeatures.features;
    const feature = createLine(points, {
      id: this.getUniqId(),
      type: 'line',
      active: true,
      pointFeatures: this.pointFeatures,
    });
    this.setCurrentFeature(feature as Feature);
    return feature;
  }
}
