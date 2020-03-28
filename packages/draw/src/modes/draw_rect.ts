import {
  IInteractionTarget,
  ILayer,
  ILngLat,
  IPopup,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
} from '@antv/l7';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  point,
} from '@turf/helpers';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createPoint, createRect } from '../util/create_geometry';
import moveFeatures, { movePoint, moveRing } from '../util/move_featrues';
import DrawCircle from './draw_circle';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawRect extends DrawCircle {
  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
  }
  public drawFinish() {
    return null;
  }

  protected createFeature(): FeatureCollection {
    const feature = createRect(
      [this.startPoint.lng, this.startPoint.lat],
      [this.endPoint.lng, this.endPoint.lat],
      {
        id: `${this.getUniqId()}`,
      },
    );
    this.setCurrentFeature(feature as Feature);
    return featureCollection([feature]);
  }
}
