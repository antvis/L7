import { IInteractionTarget, ILayer, ILngLat, Scene } from '@antv/l7';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  point,
} from '@turf/helpers';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import moveFeatures from '../util/move_featrues';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawPoint extends DrawFeature {
  protected pointFeatures: Feature[];

  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.type = 'point';
  }

  public drawFinish() {
    this.emit(DrawEvent.CREATE, this.currentFeature);
    this.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    this.disable();
  }

  protected onDragStart = (e: IInteractionTarget) => {
    return null;
  };
  protected onDragging = (e: IInteractionTarget) => {
    return null;
  };

  protected onDragEnd = () => {
    return null;
  };

  protected onClick = (e: any) => {
    const lngLat = e.lngLat;
    const feature = this.createFeature(lngLat);
    this.drawRender.update(featureCollection([feature]));
    this.drawVertexLayer.update(featureCollection([feature]));
    this.drawFinish();
  };

  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    this.drawRender.updateData(featureCollection(newFeature));
    this.drawVertexLayer.updateData(featureCollection(newFeature));
    this.currentFeature = newFeature[0];
    this.pointFeatures = newFeature;
    this.currentFeature.properties = {
      ...this.currentFeature.properties,
      pointFeatures: newFeature,
    };
    return this.currentFeature;
  }
  protected createFeature(p: ILngLat): Feature {
    const feature = point([p.lng, p.lat], {
      id: this.getUniqId(),
      pointFeatures: [point([p.lng, p.lat])],
    });
    this.setCurrentFeature(feature as Feature);
    return feature;
  }

  protected editFeature(endPoint: ILngLat): void {
    this.createFeature(endPoint);
  }

  protected showOtherLayer() {
    return null;
  }

  protected hideOtherLayer() {
    return null;
  }
}
