import {
  IInteractionTarget,
  ILayer,
  ILngLat,
  PointLayer,
  Scene,
} from '@antv/l7';
import {
  Feature,
  featureCollection,
  Geometries,
  Properties,
} from '@turf/helpers';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createCircle, createPoint } from '../util/create_geometry';
import moveFeatures, { movePoint } from '../util/move_featrues';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export default class DrawCircle extends DrawFeature {
  protected startPoint: ILngLat;
  protected endPoint: ILngLat;
  protected pointFeatures: Feature[];
  protected centerLayer: ILayer;
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
    this.type = 'circle';
  }

  public drawFinish() {
    return null;
  }

  public setCurrentFeature(feature: Feature) {
    this.currentFeature = feature as Feature;
    // @ts-ignore
    this.pointFeatures = feature.properties.pointFeatures;
    // @ts-ignore
    this.startPoint = feature.properties.startPoint;
    // @ts-ignore
    this.endPoint = feature.properties.endPoint;
    this.source.setFeatureActive(feature);
  }

  protected getDefaultOptions(): Partial<IDrawFeatureOption> {
    return {
      ...super.getDefaultOptions(),
      title: '绘制圆',
    };
  }

  protected onDragStart = (e: IInteractionTarget) => {
    if (this.drawStatus !== 'Drawing') {
      this.drawLayer.emit('unclick', null);
    }
    this.startPoint = e.lngLat;
    this.setCursor('grabbing');
    this.initCenterLayer();
    this.centerLayer.setData([this.startPoint]);
  };

  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    const feature = this.createFeature() as Feature<Geometries, Properties>;
    const properties = feature.properties as { pointFeatures: Feature[] };
    this.drawLayer.update(featureCollection([feature]));
    this.drawVertexLayer.update(featureCollection(properties.pointFeatures));
  };

  protected onDragEnd = () => {
    const feature = this.createFeature(`${this.getUniqId()}`);
    const properties = feature.properties as { pointFeatures: Feature[] };
    this.drawLayer.update(featureCollection([feature]));
    this.drawVertexLayer.update(featureCollection(properties.pointFeatures));
    this.emit(DrawEvent.CREATE, this.currentFeature);
    this.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    this.disable();
  };

  protected moveFeature(delta: ILngLat): void {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    this.drawLayer.updateData(featureCollection(newFeature));
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    const newStartPoint = movePoint(
      [this.startPoint.lng, this.startPoint.lat],
      delta,
    );
    this.startPoint = {
      lat: newStartPoint[1],
      lng: newStartPoint[0],
    };
    newFeature[0].properties = {
      ...newFeature[0].properties,
      startPoint: this.startPoint,
      pointFeatures: newPointFeture,
    };
    this.centerLayer.setData([this.startPoint]);
    this.setCurrentFeature(newFeature[0]);
  }

  protected createFeature(id: string = '0'): Feature {
    const points = createPoint([this.endPoint]);
    const feature = createCircle(
      [this.startPoint.lng, this.startPoint.lat],
      [this.endPoint.lng, this.endPoint.lat],
      {
        pointFeatures: points.features,
        units: this.getOption('units'),
        steps: this.getOption('steps'),
        id,
      },
    );
    this.setCurrentFeature(feature as Feature);
    return feature;
  }

  protected editFeature(endPoint: ILngLat): void {
    this.endPoint = endPoint;
    const newFeature = this.createFeature();
    const properties = newFeature.properties as { pointFeatures: Feature[] };
    this.drawLayer.updateData(featureCollection([newFeature]));
    this.drawVertexLayer.updateData(
      featureCollection(properties.pointFeatures),
    );
  }

  protected showOtherLayer() {
    this.centerLayer.setData([this.currentFeature?.properties?.startPoint]);
    this.centerLayer.show();
  }

  protected hideOtherLayer() {
    if (this.currentFeature) {
      this.centerLayer.hide();
    }
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
