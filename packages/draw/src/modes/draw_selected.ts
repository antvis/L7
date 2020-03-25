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
import turfCircle from '@turf/circle';
import turfDistance from '@turf/distance';
import { Feature, featureCollection, point } from '@turf/helpers';
import EditRender from '../render/selected';
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
  private editLayer: EditRender;
  constructor(scene: Scene, options: Partial<IDrawCircleOption> = {}) {
    super(scene, options);
    // this.editLayer = new EditRender(this);
  }

  public setSelectedFeature(feature: Feature) {
    this.currentFeature = feature;
    // this.editLayer.updateData({
    //   type: 'FeatureCollection',
    //   features: [feature],
    // });
    // this.editLayer.show();
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

  private createCircleData(center: ILngLat, endPoint: ILngLat) {
    const radius = turfDistance(
      point([center.lng, center.lat]),
      point([endPoint.lng, endPoint.lat]),
      this.getOption('units'),
    );
    const feature = turfCircle([center.lng, center.lat], radius, {
      units: this.getOption('units'),
      steps: this.getOption('steps'),
      properties: {
        id: `${this.currentFeature?.properties?.id}`,
        active: true,
        radius,
        center,
        endPoint,
      },
    });
    this.currentFeature = feature as Feature;
    return featureCollection([feature]);
  }

  private moveCircle(feature: Feature, delta: ILngLat) {
    const preCenter = feature?.properties?.center as ILngLat;
    const preEndPoint = feature?.properties?.endPoint as ILngLat;
    const newCenter = {
      lng: preCenter.lng + delta.lng,
      lat: preCenter.lat + delta.lat,
    };
    const newEndPoint = {
      lng: preEndPoint.lng + delta.lng,
      lat: preEndPoint.lat + delta.lat,
    };

    const newCircle = this.createCircleData(newCenter, newEndPoint);
    // this.centerLayer.setData([newCenter]);
    this.editLayer.updateData(newCircle);
  }
}
