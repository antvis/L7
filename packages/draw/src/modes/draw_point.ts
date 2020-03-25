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
import { createPoint, createPolygon } from '../util/create_geometry';
import moveFeatures, { movePoint, moveRing } from '../util/move_featrues';
import { renderFeature } from '../util/renderFeature';
import DrawFeature, { IDrawFeatureOption } from './draw_feature';
export interface IDrawRectOption extends IDrawFeatureOption {
  units: unitsType;
  steps: number;
}
export default class DrawPoint extends DrawFeature {
  private drawLayers: ILayer[] = [];
  private drawPointLayers: ILayer[] = [];

  constructor(scene: Scene, options: Partial<IDrawRectOption> = {}) {
    super(scene, options);
    this.selectLayer = new selectRender(this);
  }

  public drawFinish() {
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
    const feature = this.createFeature(lngLat);
    this.drawLayers = this.addDrawLayer(this.drawLayers, feature);
    this.disable();
    // this.drawFinish();
  };

  protected moveFeature(delta: ILngLat): Feature {
    const newFeature = moveFeatures([this.currentFeature as Feature], delta)[0];
    return newFeature;
  }
  protected createFeature(p: ILngLat): FeatureCollection {
    const feature = point([p.lng, p.lat], {
      id: this.getUniqId(),
    });
    this.setCurrentFeature(feature as Feature);
    return {
      type: 'FeatureCollection',
      features: [feature],
    };
  }

  protected editFeature(endPoint: ILngLat): FeatureCollection {
    return this.createFeature(endPoint);
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
