import { Scene } from '@antv/l7';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  point,
} from '@turf/helpers';
import { unitsType } from '../util/constant';
import { createRect } from '../util/create_geometry';
import DrawCircle from './draw_circle';
import { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawRect extends DrawCircle {
  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.type = 'rect';
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
