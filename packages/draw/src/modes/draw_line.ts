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
import { Feature, FeatureCollection, Geometries, point } from '@turf/helpers';
import selectRender from '../render/selected';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createLine, createPoint } from '../util/create_geometry';
import moveFeatures, { movePoint, moveRing } from '../util/move_featrues';
import { renderFeature } from '../util/renderFeature';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawLine extends DrawFeature {
  private startPoint: ILngLat;
  private endPoint: ILngLat;
  private points: ILngLat[] = [];
  private drawLayers: ILayer[] = [];
  private drawPointLayers: ILayer[] = [];

  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.selectLayer = new selectRender(this);
  }
  public enable() {
    super.enable();
    this.scene.on('mousemove', this.onMouseMove);
    this.scene.on('dblclick', this.onDblClick);
    // 关闭双击放大
  }

  public disable() {
    super.disable();
    this.scene.off('mousemove', this.onMouseMove);
    this.scene.off('dblclick', this.onDblClick);
  }

  public drawFinish() {
    const feature = this.createFeature(this.points);
    this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
    const pointfeatures = createPoint(this.points);
    this.drawPointLayers = this.addDrawLayer(
      this.drawPointLayers,
      pointfeatures,
    );
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
    this.endPoint = lngLat;
    this.points.push(lngLat);
    const feature = this.createFeature(this.points);
    const pointfeatures = createPoint([this.endPoint]);
    this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
    this.drawPointLayers = this.addDrawLayer(
      this.drawPointLayers,
      pointfeatures,
    );
    this.drawPointLayers[0].on('mousemove', () => {
      this.setCursor('pointer');
    });
    this.drawPointLayers[0].on('unmousemove', () => {
      this.setCursor('crosshair');
    });
    this.drawPointLayers[0].on('click', () => {
      this.resetCursor();
      this.drawFinish();
    });
  };

  protected onMouseMove = (e: any) => {
    const lngLat = e.lngLat;
    if (this.points.length === 0) {
      return;
    }
    const tmpPoints = this.points.slice();
    tmpPoints.push(lngLat);
    const feature = this.createFeature(tmpPoints);
    this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
  };

  protected onDblClick = (e: any) => {
    const lngLat = e.lngLat;
    if (this.points.length < 1) {
      // TODO: 清空图层
      return;
    }
    this.points.push(lngLat);
    this.drawFinish();
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
  protected createFeature(points: ILngLat[]): FeatureCollection {
    const feature = createLine(points, {
      id: this.getUniqId(),
    });
    this.setCurrentFeature(feature as Feature);
    return {
      type: 'FeatureCollection',
      features: [feature],
    };
  }

  protected editFeature(endPoint: ILngLat): FeatureCollection {
    this.endPoint = endPoint;
    return this.createFeature(this.points);
  }

  private addDrawLayer(drawLayers: ILayer[], fc: FeatureCollection) {
    if (drawLayers.length !== 0) {
      drawLayers.map((layer) => this.scene.removeLayer(layer));
    }
    const style = this.getStyle('active');
    drawLayers = renderFeature(fc, style);
    drawLayers.map((layer) => this.scene.addLayer(layer));
    return drawLayers;
  }
}
