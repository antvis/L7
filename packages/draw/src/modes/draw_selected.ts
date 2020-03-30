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
import { Feature, featureCollection, point } from '@turf/helpers';
import { DrawEvent, DrawModes } from '../util/constant';
import moveFeatures from '../util/move_featrues';
import DrawFeature, { IDrawOption } from './draw_mode';
export type unitsType = 'degrees' | 'radians' | 'miles' | 'kilometers';
export interface IDrawCircleOption extends IDrawOption {
  units: unitsType;
  steps: number;
}
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
export default class DrawSelect extends DrawFeature {
  private center: ILngLat;
  private dragStartPoint: ILngLat;
  // 绘制完成之后显示
  constructor(scene: Scene, options: Partial<IDrawCircleOption> = {}) {
    super(scene, options);
    // this.editLayer = new EditRender(this);
  }

  public setSelectedFeature(feature: Feature) {
    this.currentFeature = feature;
  }

  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
    this.scene.map.dragPan.disable();
    this.dragStartPoint = e.lngLat;
  };
  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometres',
      cursor: 'move',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    const delta = {
      lng: e.lngLat.lng - this.dragStartPoint.lng,
      lat: e.lngLat.lat - this.dragStartPoint.lat,
    };
    this.emit(DrawEvent.Move, delta);
    this.dragStartPoint = e.lngLat;

    return;
  };

  protected onDragEnd = () => {
    this.emit(DrawEvent.UPDATE, this.currentFeature);
  };
  protected onClick = () => {
    return null;
  };
}
