import { IInteractionTarget, ILayer, Scene } from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
import { Feature, FeatureCollection } from '@turf/helpers';
import Draw from '../modes/draw_feature';
import { DrawEvent, DrawModes } from '../util/constant';
import BaseRender from './base_render';
import { renderFeature } from './renderFeature';
export default class DrawLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('active');
    this.drawLayers = renderFeature(feature, style);
    this.addLayers();
  }
  public enableDrag() {
    this.show();
    if (this.isEnableDrag) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseMove);
    layer.on('mouseout', this.onUnMouseMove);
    layer.on('click', this.onClick);
    layer.on('unmouseup', this.onUnClick);
    this.isEnableDrag = true;
  }
  public disableDrag() {
    if (!this.isEnableDrag) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseMove);
    layer.off('mouseout', this.onUnMouseMove);
    layer.off('click', this.onClick);
    layer.off('unmouseup', this.onUnClick);
    this.isEnableDrag = false;
  }

  public enableEdit() {
    if (this.isEnableEdit) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.on('unclick', this.onUnClick);
    this.isEnableDrag = true;
  }

  public disableEdit() {
    if (!this.isEnableEdit) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.off('unclick', this.onUnClick);
    this.isEnableDrag = false;
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
    this.draw.editMode.enable();
    this.disableDrag();
    this.draw.resetCursor();
    this.enableEdit();
    this.draw.setCurrentFeature(e.feature);
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.DIRECT_SELECT);
  };

  private onUnClick = (e: any) => {
    this.draw.selectMode.disable();
    this.draw.editMode.disable();
    this.draw.source.setFeatureUnActive(
      this.draw.getCurrentFeature() as Feature,
    );
    this.disableDrag();
    this.disableEdit();
    this.hide();
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.STATIC);
  };
}
