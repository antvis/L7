import { IInteractionTarget, ILayer, Scene } from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
type CallBack = (...args: any[]) => any;
import { FeatureCollection } from '@turf/helpers';
import Draw from '../modes/draw_feature';
import { DrawEvent, DrawModes } from '../util/constant';
import { renderFeature } from '../util/renderFeature';
export default class DrawVertexLayer {
  public drawLayers: ILayer[] = [];
  private draw: Draw;
  constructor(draw: Draw) {
    this.draw = draw;
  }
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('active');
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
  public updateData(data: any) {
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

  public enableDrag() {
    const layer = this.drawLayers[0];
    layer.on('mousemove', this.onMouseMove);
    layer.on('mouseout', this.onUnMouseMove);
    layer.on('click', this.onClick);
  }
  public disableDrag() {
    const layer = this.drawLayers[0];
    layer.off('mousemove', this.onMouseMove);
    layer.off('mouseout', this.onUnMouseMove);
    layer.off('click', this.onClick);
  }

  private onMouseMove = (e: any) => {
    this.draw.setCursor('pointer');
    // this.draw.editMode.enable();
  };
  private onUnMouseMove = (e: any) => {
    this.draw.resetCursor();
    // this.draw.editMode.disable();
  };
  private onClick = (e: any) => {
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.DIRECT_SELECT);
    this.draw.selectMode.disable();
    this.disableDrag();
    this.draw.editMode.enable();
  };
}
