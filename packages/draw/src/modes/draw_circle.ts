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
export default class DrawCircle extends DrawFeature {
  private center: ILngLat;
  private endPoint: ILngLat;
  private dragStartPoint: ILngLat;
  // 绘制完成之后显示
  private normalLayer: ILayer;
  private normalLineLayer: ILayer;

  // 编辑过程中显示
  private centerLayer: ILayer;
  private circleLayer: ILayer;
  private circleLineLayer: ILayer;
  private currentFeature: Feature | null;
  private popup: IPopup;
  constructor(scene: Scene, options: Partial<IDrawCircleOption> = {}) {
    super(scene, options);
    this.initNormalLayer();
  }
  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
    this.scene.map.dragPan.disable();
    this.dragStartPoint = e.lngLat;
    if (this.drawStatus === 'DrawSelected') {
      return;
    }
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
    this.initDrawLayer();
    this.centerLayer = layer;
    this.setCursor('grabbing');
  };
  protected getDefaultOptions() {
    return {
      steps: 4,
      units: 'kilometres',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    if (this.drawStatus === 'DrawSelected') {
      const delta = {
        lng: e.lngLat.lng - this.dragStartPoint.lng,
        lat: e.lngLat.lat - this.dragStartPoint.lat,
      };
      this.moveCircle(this.currentFeature as Feature, delta);
      this.dragStartPoint = e.lngLat;

      return;
    }
    this.endPoint = e.lngLat;
    const currentData = this.createCircleData(this.center, this.endPoint);
    this.updateDrawLayer(currentData);
    this.addDrawPopup(this.endPoint, this.currentFeature?.properties?.radius);
    return;
  };

  protected onDragEnd = () => {
    if (this.drawStatus === 'DrawSelected') {
      return;
    }
    this.source.addFeature(this.currentFeature);
    // @ts-ignore
    this.scene.map.dragPan.enable();
    this.popup.remove();
    // this.disable();
    this.addCircleLayerEvent();
    this.drawStatus = 'DrawSelected';
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
    this.updateNormalLayer();
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
  private addDrawPopup(lnglat: ILngLat, dis: number) {
    const popup = new Popup({
      anchor: 'left',
      closeButton: false,
    })
      .setLnglat(lnglat)
      .setText(`${dis}`);
    this.scene.addPopup(popup);
    this.popup = popup;
  }

  private initNormalLayer() {
    const style = this.getStyle('normal_fill');
    const linestyle = this.getStyle('normal_line');
    this.normalLayer = new PolygonLayer()
      .source(this.source.data)
      .shape('fill')
      .active(true)
      .color(style.color)
      .style(style.style);

    this.normalLineLayer = new LineLayer()
      .source(this.source.data)
      .shape('line')
      .size(linestyle.size)
      .color(linestyle.color)
      .style(linestyle.style);
    this.scene.addLayer(this.normalLayer);
    this.scene.addLayer(this.normalLineLayer);
    this.normalLayer.on('click', this.onNormalLayerClick);
  }
  private updateNormalLayer() {
    this.normalLayer.setData(this.source.data);
    this.normalLineLayer.setData(this.source.data);
  }

  private onNormalLayerClick = (e: any) => {
    this.currentFeature = e.feature;
    this.normalLayer.filter('id', (id: string) => {
      return this.currentFeature === null || id !== e.feature.properties.id;
    });
    this.normalLineLayer.filter('id', (id: string) => {
      return this.currentFeature === null || id !== e.feature.properties.id;
    });
    const seletedFeature = e.feature;
    this.setCursor('move');
    this.updateDrawLayer(featureCollection([seletedFeature]));
    this.centerLayer.setData([seletedFeature.properties.center]);
    this.drawStatus = 'DrawSelected';
    this.enable();
  };

  private addCircleLayerEvent() {
    this.circleLayer.on('mousemove', (e) => {
      this.setCursor('move');
    });
    this.circleLayer.on('unmousemove', (e) => {
      this.resetCursor();
    });
    this.circleLayer.on('unclick', this.onCircleLayerClick);
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
    this.centerLayer.setData([newCenter]);
    this.updateDrawLayer(newCircle);
  }
}
