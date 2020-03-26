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
import { Feature, FeatureCollection, featureCollection } from '@turf/helpers';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createCircle, createPoint } from '../util/create_geometry';
import moveFeatures, { movePoint } from '../util/move_featrues';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawCircle extends DrawFeature {
  protected startPoint: ILngLat;
  protected endPoint: ILngLat;
  protected pointFeatures: Feature[];
  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    // this.selectLayer = new selectRender(this);
  }

  public drawFinish() {
    return null;
  }
  protected onDragStart = (e: IInteractionTarget) => {
    this.startPoint = e.lngLat;
    this.setCursor('grabbing');
    this.initCenterLayer();
    // this.initDrawFillLayer();
    this.centerLayer.setData([this.startPoint]);
  };
  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    const feature = this.createFeature();
    const pointfeatures = createPoint([this.endPoint]);
    this.pointFeatures = pointfeatures.features;
    this.drawRender.update(feature);
    this.drawVertexLayer.update(pointfeatures);
  };

  protected onDragEnd = () => {
    this.emit(DrawEvent.CREATE, this.currentFeature);
    this.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    this.disable();
  };

  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    this.drawRender.updateData(featureCollection(newFeature));
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    this.currentFeature = newFeature[0];
    const newStartPoint = movePoint(
      [this.startPoint.lng, this.startPoint.lat],
      delta,
    );
    this.startPoint = {
      lat: newStartPoint[1],
      lng: newStartPoint[0],
    };
    this.centerLayer.setData([this.startPoint]);
    return this.currentFeature;
  }

  protected createFeature(): FeatureCollection {
    const feature = createCircle(
      [this.startPoint.lng, this.startPoint.lat],
      [this.endPoint.lng, this.endPoint.lat],
      {
        units: this.getOption('units'),
        steps: this.getOption('steps'),
        id: `${this.getUniqId()}`,
      },
    );
    this.setCurrentFeature(feature as Feature);
    return featureCollection([feature]);
  }

  protected editFeature(endPoint: ILngLat): FeatureCollection {
    this.endPoint = endPoint;
    return this.createFeature();
  }

  private initCenterLayer() {
    const centerStyle = this.getStyle('active').point;
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
