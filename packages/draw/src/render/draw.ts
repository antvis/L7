import { IInteractionTarget, ILayer, Scene } from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
import { FeatureCollection } from '@turf/helpers';
import Draw from '../modes/draw_feature';
import { DrawEvent, DrawModes } from '../util/constant';
import { renderFeature } from '../util/renderFeature';
import BaseRender from './base_render';
export default class DrawLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('active');
    this.drawLayers = renderFeature(feature, style);
    this.addLayers();
  }
  public enableDrag() {
    this.show();
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseMove);
    layer.on('mouseout', this.onUnMouseMove);
    layer.on('click', this.onClick);
    layer.on('unclick', this.onUnClick);
  }
  public disableDrag() {
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseMove);
    layer.off('mouseout', this.onUnMouseMove);
    layer.off('click', this.onClick);
    layer.off('unclick', this.onUnClick);
  }

  public enableEdit() {
    const layer = this.drawLayers[0];
    layer.on('unclick', this.onUnClick);
  }

  public disableEdit() {
    const layer = this.drawLayers[0];
    layer.off('unclick', this.onUnClick);
  }

  private onMouseMove = (e: any) => {
    this.draw.setCursor('move');
    this.draw.selectMode.enable();
  };
  private onUnMouseMove = (e: any) => {
    this.draw.resetCursor();
    this.draw.selectMode.disable();
  };
  private onClick = (e: any) => {
    this.draw.selectMode.disable();
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.DIRECT_SELECT);
    this.disableDrag();
    this.draw.resetCursor();
    this.enableEdit();
  };
  private onUnClick = (e: any) => {
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.STATIC);
    this.draw.selectMode.disable();
    this.disableDrag();
    this.hide();
  };
}
