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
import RenderLayer from '../render/render';
import DrawFeature, { IDrawOption } from './draw_feature';
import DrawSelected from './draw_selected';
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
export default class DrawCircle extends DrawFeature {
  private center: ILngLat;
  private endPoint: ILngLat;
  private dragStartPoint: ILngLat;
  // 绘制完成之后显示
  private normalLayer: RenderLayer;
  private selectMode: DrawSelected;
  // 编辑过程中显示
  private centerLayer: ILayer;
  private circleLayer: ILayer;
  private circleLineLayer: ILayer;
  private currentFeature: Feature | null;
  private popup: IPopup;
  constructor(scene: Scene, options: Partial<IDrawCircleOption> = {}) {
    super(scene, options);
    this.normalLayer = new RenderLayer(this);
  }
  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
    this.dragStartPoint = e.lngLat;
    this.center = e.lngLat;
    const centerStyle = this.getStyle('active_point');
    const layer = new PointLayer()
      .source([this.center], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .color(centerStyle.color)
      .size(centerStyle.size)
      .style(centerStyle.style);
    this.scene.addLayer(layer);
    this.centerLayer = layer;
    this.initDrawLayer();
    this.setCursor('grabbing');
  };
  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometres',
      cursor: 'crosshair',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    const currentData = this.createCircleData(this.center, this.endPoint);
    this.updateDrawLayer(currentData);
    this.addDrawPopup(this.endPoint, this.currentFeature?.properties?.radius);
    return;
  };

  protected onDragEnd = () => {
    this.source.addFeature(this.currentFeature);
    // @ts-ignore
    this.scene.map.dragPan.enable();
    this.popup.remove();
    // 绘制完成进入选中状态
    this.selectMode = new DrawSelected(this.scene, {});
    this.selectMode.setSelectedFeature(this.currentFeature as Feature);
    this.removeDrawLayer();
    this.drawStatus = 'DrawSelected';
    this.disable();
    return;
  };
  protected onClick = () => {
    return null;
  };
  protected onCircleLayerClick = () => {
    if (this.currentFeature === null) {
      return;
    }
    this.currentFeature = null;
    this.normalLayer.updateData();
    this.centerLayer.setData([]);
    this.circleLayer.setData(InitFeature);
    this.circleLineLayer.setData(InitFeature);
    return;
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

  private initDrawLayer() {
    const style = this.getStyle('active_fill');
    const linestyle = this.getStyle('active_line');
    this.circleLayer = new PolygonLayer()
      .source(InitFeature)
      .color(style.color)
      .shape('fill')
      .style(style.style);
    this.circleLineLayer = new PolygonLayer()
      .source(InitFeature)
      .color(linestyle.color)
      .size(linestyle.size)
      .shape('line')
      .style(linestyle.style);
    this.scene.addLayer(this.circleLayer);
    this.scene.addLayer(this.circleLineLayer);
  }

  private updateDrawLayer(currentData: any) {
    this.circleLayer.setData(currentData);
    this.circleLineLayer.setData(currentData);
  }

  private removeDrawLayer() {
    this.scene.removeLayer(this.circleLayer);
    this.scene.removeLayer(this.circleLineLayer);
    this.scene.removeLayer(this.centerLayer);
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
