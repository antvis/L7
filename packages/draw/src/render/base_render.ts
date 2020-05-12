import { IInteractionTarget, ILayer, Scene } from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
type CallBack = (...args: any[]) => any;
import { FeatureCollection } from '@turf/helpers';
import Draw from '../modes/draw_feature';
import { DrawEvent, DrawModes } from '../util/constant';
import { renderFeature } from './renderFeature';
export default class BaseRenderLayer {
  public drawLayers: ILayer[] = [];
  protected draw: Draw;
  protected isEnableDrag: boolean;
  protected isEnableEdit: boolean;
  constructor(draw: Draw) {
    this.draw = draw;
  }
  public update(feature: FeatureCollection) {
    if (this.drawLayers.length > 0) {
      this.updateData(feature);
    }
    this.removeLayers();
    const style = this.draw.getStyle('normal');
    this.drawLayers = renderFeature(feature, style);
    this.addLayers();
  }
  public on(type: any, handler: CallBack) {
    const layer = this.drawLayers[0];
    layer.on(type, handler);
  }
  public off(type: any, handler: CallBack) {
    const layer = this.drawLayers[0];
    layer.off(type, handler);
  }

  public emit(type: string, e: any) {
    const layer = this.drawLayers[0];
    layer.emit(type, e);
  }

  public updateData(data: any) {
    if (this.drawLayers.length === 0) {
      this.update(data);
    }
    this.drawLayers.forEach((layer) => layer.setData(data));
  }

  public destroy() {
    this.removeLayers();
  }

  public removeLayers() {
    if (this.drawLayers.length !== 0) {
      this.drawLayers.forEach((layer) => this.draw.scene.removeLayer(layer));
    }
  }
  public addLayers() {
    this.drawLayers.forEach((layer) => this.draw.scene.addLayer(layer));
  }

  public show() {
    this.drawLayers.forEach((layer) => layer.show());
  }

  public hide() {
    this.drawLayers.forEach((layer) => layer.hide());
  }
}
