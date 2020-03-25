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
import {
  Feature,
  FeatureCollection,
  featureCollection,
  Geometries,
  point,
} from '@turf/helpers';
import drawRender from '../render/draw';
import selectRender from '../render/selected';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createPoint, createPolygon } from '../util/create_geometry';
import moveFeatures, { movePoint, moveRing } from '../util/move_featrues';
import { renderFeature } from '../util/renderFeature';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawPolygon extends DrawFeature {
  private startPoint: ILngLat;
  private endPoint: ILngLat;
  private points: ILngLat[] = [];
  private pointFeatures: Feature[];
  private drawLayers: ILayer[] = [];
  private drawPointLayers: ILayer[] = [];

  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
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
    // this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
    this.drawRender.update(feature);
    const pointfeatures = createPoint(this.points);
    this.pointFeatures = pointfeatures.features;
    this.drawVertexLayer.update(pointfeatures);
    // this.drawPointLayers = this.addDrawLayer(
    //   this.drawPointLayers,
    //   pointfeatures,
    // );
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
    const pointfeatures = createPoint([this.points[0], this.endPoint]);
    this.pointFeatures = pointfeatures.features;
    // this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
    this.drawRender.update(feature);
    this.drawVertexLayer.update(pointfeatures);
    this.onDraw();
    // this.drawPointLayers = this.addDrawLayer(
    //   this.drawPointLayers,
    //   pointfeatures,
    // );
    // this.drawPointLayers[0].on('mousemove', () => {
    //   this.setCursor('pointer');
    // });
    // this.drawPointLayers[0].on('unmousemove', () => {
    //   this.setCursor('crosshair');
    // });
    // this.drawPointLayers[0].on('click', () => {
    //   this.resetCursor();
    //   this.drawFinish();
    // });
  };

  protected onMouseMove = (e: any) => {
    const lngLat = e.lngLat;
    if (this.points.length === 0) {
      return;
    }
    const tmpPoints = this.points.slice();
    tmpPoints.push(lngLat);
    const feature = this.createFeature(tmpPoints);
    this.drawRender.update(feature);
    // this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
  };

  protected onDblClick = (e: any) => {
    const lngLat = e.lngLat;
    if (this.points.length < 2) {
      return;
    }
    this.points.push(lngLat);
    this.drawFinish();
  };

  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawRender.updateData(featureCollection(newFeature));
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    this.currentFeature = newFeature[0];
    this.pointFeatures = newPointFeture;
    return this.currentFeature;
  }
  protected createFeature(points: ILngLat[]): FeatureCollection {
    const feature = createPolygon(points, {
      id: this.getUniqId(),
      active: true,
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

  protected onDraw = () => {
    this.drawVertexLayer.on('mousemove', (e: any) => {
      this.setCursor('pointer');
    });
    this.drawVertexLayer.on('mouseout', () => {
      this.setCursor('crosshair');
    });
    this.drawVertexLayer.on('click', () => {
      this.resetCursor();
      this.drawFinish();
    });
  };
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
/**
 * draw 端点响应事件
 * select Polyon 响应事件
 * edit 端点 中心点响应事件
 */
