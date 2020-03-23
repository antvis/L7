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
import EditRender from '../render/edit';
import DrawFeature, { IDrawOption } from './draw_feature';
let CircleFeatureId = 0;
export type unitsType = 'degrees' | 'radians' | 'miles' | 'kilometers';
export interface IDrawCircleOption extends IDrawOption {
  units: unitsType;
  steps: number;
}
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
export default class DrawEdit extends DrawFeature {
  private center: ILngLat;
  private endPoint: ILngLat;
  // 绘制完成之后显示
  private editLayer: EditRender;
  // 编辑过程中显示
  private currentFeature: Feature | null;
  private popup: IPopup;
  constructor(scene: Scene, options: Partial<IDrawCircleOption> = {}) {
    super(scene, options);
    this.editLayer = new EditRender(this);
  }

  public setEditFeature(feature: Feature) {
    this.currentFeature = feature;
    this.center = feature?.properties?.center;
    this.editLayer.updateData({
      type: 'FeatureCollection',
      features: [feature],
    });
  }

  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
  };
  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometres',
      cursor: 'move',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    const currentData = this.createCircleData(this.center, this.endPoint);
    this.editLayer.updateData(currentData);

    this.addDrawPopup(this.endPoint, this.currentFeature?.properties?.radius);
    return;
  };

  protected onDragEnd = () => {
    this.popup.remove();
    this.disable();
    // @ts-ignore
    this.scene.map.dragPan.enable();
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
        id: `${CircleFeatureId++}`,
        radius,
        center,
        endPoint,
      },
    });
    this.currentFeature = feature as Feature;
    return featureCollection([feature]);
  }

  private addDrawPopup(lnglat: ILngLat, dis: number) {
    const popup = new Popup({
      anchor: 'left',
      closeButton: false,
    })
      .setLnglat(lnglat)
      .setText(`半径:${dis.toFixed(2)}千米`);
    this.scene.addPopup(popup);
    this.popup = popup;
  }
}
