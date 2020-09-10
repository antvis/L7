import { IInteractionTarget, ILayer, ILngLat, Scene } from '@antv/l7';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  Geometries,
  point,
  Position,
  Properties,
} from '@turf/helpers';
import DrawMidVertex from '../render/draw_mid_vertex';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import { createPoint, createPolygon } from '../util/create_geometry';
import moveFeatures from '../util/move_featrues';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawPolygon extends DrawFeature {
  protected startPoint: ILngLat;
  protected endPoint: ILngLat;
  protected points: ILngLat[] = [];
  protected pointFeatures: Feature[];
  protected drawMidVertexLayer: DrawMidVertex;

  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.type = 'polygon';
    this.drawMidVertexLayer = new DrawMidVertex(this);
    this.on(DrawEvent.MODE_CHANGE, this.addMidLayerEvent);
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
    this.points = this.points.reverse();
    const feature = this.createFeature(this.points);
    const properties = feature.properties as { pointFeatures: Feature[] };
    this.drawLayer.update(featureCollection([feature]));
    this.drawVertexLayer.update(featureCollection(properties.pointFeatures));
    // @ts-ignore
    this.emit(DrawEvent.CREATE, this.currentFeature);
    this.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    this.points = [];
    this.disable();
  }

  public addVertex(vertex: Feature<Geometries, Properties>) {
    // @ts-ignore
    const id = vertex.properties.id;
    const coord = vertex?.geometry?.coordinates as Position;
    const feature = this.currentFeature as Feature<Geometries, Properties>;
    const type = feature?.geometry?.type;
    const points = [];
    if (type === 'Polygon') {
      const coords = feature?.geometry?.coordinates as Position[][];
      coords[0].splice(id + 1, 0, coord);
      for (let i = 0; i < coords[0].length - 1; i++) {
        points.push({
          lng: coords[0][i][0],
          lat: coords[0][i][1],
        });
      }
    } else {
      const coords = feature?.geometry?.coordinates as Position[];
      coords.splice(id + 1, 0, coord);
      for (const coor of coords) {
        points.push({
          lng: coor[0],
          lat: coor[1],
        });
      }
    }
    const pointfeatures = createPoint(points);
    this.pointFeatures = pointfeatures.features;
    this.drawLayer.updateData(featureCollection([feature]));
    this.drawVertexLayer.updateData(pointfeatures);
    this.drawMidVertexLayer.updateData(featureCollection(this.pointFeatures));
    // @ts-ignore
    feature.properties.pointFeatures = pointfeatures.features;
    this.setCurrentFeature(feature);
  }

  protected getDefaultOptions(): Partial<IDrawFeatureOption> {
    return {
      ...super.getDefaultOptions(),
      title: '绘制多边形',
    };
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
    if (this.drawStatus !== 'Drawing') {
      this.drawLayer.emit('unclick', null);
    }
    const lngLat = e.lngLat || e.lnglat;
    this.endPoint = lngLat;
    this.points.push(lngLat);
    const feature = this.createFeature(this.points);
    const pointfeatures = createPoint([this.points[0], this.endPoint]);
    this.drawLayer.update(featureCollection([feature]));
    this.drawVertexLayer.update(featureCollection(pointfeatures.features));
    this.onDraw();
  };

  protected onMouseMove = (e: any) => {
    const lngLat = e.lngLat || e.lnglat;
    if (this.points.length === 0) {
      return;
    }
    const tmpPoints = this.points.slice();
    tmpPoints.push(lngLat);
    const feature = this.createFeature(tmpPoints);
    this.drawLayer.update(featureCollection([feature]));
  };

  protected onDblClick = (e: any) => {
    const lngLat = e.lngLat || e.lnglat;
    if (this.points.length < 2) {
      return;
    }
    this.points.push(lngLat);
    this.drawFinish();
  };

  protected moveFeature(delta: ILngLat): void {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta);
    const newPointFeture = moveFeatures(this.pointFeatures, delta);
    this.drawLayer.updateData(featureCollection(newFeature));
    this.drawVertexLayer.updateData(featureCollection(newPointFeture));
    newFeature[0].properties = {
      ...newFeature[0].properties,
      pointFeatures: newPointFeture,
    };
    this.setCurrentFeature(newFeature[0]);
  }
  protected createFeature(
    points: ILngLat[],
    id?: string,
    active: boolean = true,
  ): Feature {
    const pointfeatures = createPoint(points);
    this.pointFeatures = pointfeatures.features;
    const feature = createPolygon(points, {
      id: id || this.getUniqId(),
      type: 'polygon',
      active,
      pointFeatures: this.pointFeatures,
    });
    this.setCurrentFeature(feature as Feature);
    return feature;
  }

  protected editFeature(vertex: ILngLat): void {
    const selectVertexed = this.currentVertex as Feature<
      Geometries,
      Properties
    >;
    if (selectVertexed === null) {
      return;
    } else {
      // @ts-ignore
      const id = selectVertexed.properties.id * 1;
      // @ts-ignore
      selectVertexed.geometry.coordinates = [vertex.lng, vertex.lat];
      // @ts-ignore
      this.pointFeatures[id].geometry.coordinates = [vertex.lng, vertex.lat];
      this.drawVertexLayer.updateData(featureCollection(this.pointFeatures));
      this.drawMidVertexLayer.updateData(featureCollection(this.pointFeatures));
      this.editPolygonVertex(id, vertex);
      this.drawLayer.updateData(
        featureCollection([this.currentFeature as Feature]),
      );
      const feature = this.currentFeature as Feature;
      feature.properties = {
        ...this.currentFeature?.properties,
        pointFeatures: this.pointFeatures,
      };
      this.setCurrentFeature(feature);
    }
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

  protected showOtherLayer() {
    // if (this.editMode.isEnable) {
    //   this.drawMidVertexLayer.update(featureCollection(this.pointFeatures));
    //   this.drawMidVertexLayer.show();
    // }
    return null;
  }

  protected hideOtherLayer() {
    return null;
  }

  protected addMidLayerEvent(mode: DrawModes[any]) {
    switch (mode) {
      case DrawModes.DIRECT_SELECT:
        this.drawMidVertexLayer.update(featureCollection(this.pointFeatures));
        this.drawMidVertexLayer.show();
        break;
      case DrawModes.STATIC:
        this.drawMidVertexLayer.hide();
        break;
    }
  }
  protected initData(): boolean {
    const features: Feature[] = [];
    this.source.data.features.forEach((feature) => {
      if (feature.geometry.type === 'Polygon') {
        const points = (feature.geometry.coordinates[0] as Position[]).map(
          (coord) => {
            return {
              lng: coord[0],
              lat: coord[1],
            };
          },
        );
        features.push(
          this.createFeature(points.slice(1), feature?.properties?.id, false),
        );
      }
    });
    this.source.data.features = features;
    return true;
  }

  private editPolygonVertex(id: number, vertex: ILngLat) {
    const feature = this.currentFeature as Feature<Geometries, Properties>;
    const type = feature?.geometry?.type;
    if (type === 'Polygon') {
      const coords = feature?.geometry?.coordinates as Position[][];
      coords[0][id] = [vertex.lng, vertex.lat];
      if (-id === 0) {
        coords[0][coords[0].length - 1] = [vertex.lng, vertex.lat];
      }
    } else {
      const coords = feature?.geometry?.coordinates as Position[];
      coords[id] = [vertex.lng, vertex.lat];
    }
    this.setCurrentFeature(feature);
    this.drawLayer.updateData(
      featureCollection([this.currentFeature as Feature]),
    );
  }
}
/**
 * draw 端点响应事件
 * select Polyon 响应事件
 * edit 端点 中心点响应事件
 */
