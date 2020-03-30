import { IInteractionTarget, ILayer, ILngLat, Scene } from '@antv/l7';
import { Feature, FeatureCollection, featureCollection } from '@turf/helpers';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createLine } from '../util/create_geometry';
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
  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawRender.updateData(featureCollection(newFeature));
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    this.currentFeature = newFeature[0];
    this.pointFeatures = newPointFeture;
    return this.currentFeature;
  }
  protected createFeature(points: ILngLat[]): FeatureCollection {
    const feature = createLine(points, {
      id: this.getUniqId(),
      type: 'line',
    });
    this.setCurrentFeature(feature as Feature);
    return {
      type: 'FeatureCollection',
      features: [feature],
    };
  }
}
