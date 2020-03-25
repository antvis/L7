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
import { Feature, FeatureCollection, point } from '@turf/helpers';
import selectRender from '../render/selected';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createRect } from '../util/create_geometry';
import moveFeatures, { movePoint, moveRing } from '../util/move_featrues';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawRect extends DrawFeature {
  private startPoint: ILngLat;
  private endPoint: ILngLat;
  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.selectLayer = new selectRender(this);
  }
  public drawFinish() {
    return null;
  }
  protected onDragStart = (e: IInteractionTarget) => {
    this.startPoint = e.lngLat;
    this.setCursor('grabbing');
    this.initCenterLayer();
    this.initDrawFillLayer();
    this.centerLayer.setData([this.startPoint]);
  };
  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    const feature = this.createFeature();
    this.updateDrawFillLayer(feature);
  };

  protected onDragEnd = () => {
    this.emit(DrawEvent.CREATE, this.currentFeature);
    this.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    this.disable();
  };

  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta)[0];
    const properties = newFeature.properties as {
      startPoint: [number, number];
      endPoint: [number, number];
    };
    const { startPoint, endPoint } = properties;
    properties.startPoint = movePoint(startPoint, delta);
    properties.endPoint = movePoint(endPoint, delta);
    newFeature.properties = properties;
    this.startPoint = {
      lat: startPoint[1],
      lng: startPoint[0],
    };
    this.endPoint = {
      lat: endPoint[1],
      lng: endPoint[0],
    };
    return newFeature;
  }

  protected createFeature(): FeatureCollection {
    const feature = createRect(
      [this.startPoint.lng, this.startPoint.lat],
      [this.endPoint.lng, this.endPoint.lat],
    );
    this.setCurrentFeature(feature as Feature);
    return {
      type: 'FeatureCollection',
      features: [feature],
    };
  }

  protected editFeature(endPoint: ILngLat): FeatureCollection {
    this.endPoint = endPoint;
    return this.createFeature();
  }

  private initCenterLayer() {
    const centerStyle = this.getStyle('active_point');
    const layer = new PointLayer()
      .source([this.startPoint], {
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
  }
}
