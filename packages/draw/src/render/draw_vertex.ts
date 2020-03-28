import { FeatureCollection } from '@turf/helpers';
import { DrawEvent, DrawModes } from '../util/constant';
import { renderFeature } from '../util/renderFeature';
import BaseRender from './base_render';
export default class DrawVertexLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('active');
    this.drawLayers = renderFeature(feature, style);
    this.addLayers();
  }
  public enableDrag() {
    // const layer = this.drawLayers[0];
    // layer.on('mousemove', this.onMouseEnter);
    // layer.on('mouseout', this.onMouseOut);
    // layer.on('click', this.onClick);
  }
  public disableDrag() {
    // const layer = this.drawLayers[0];
    // layer.off('mousemove', this.onMouseEnter);
    // layer.off('mouseout', this.onMouseOut);
    // layer.off('click', this.onClick);
  }

  public enableEdit() {
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseEnter);
    layer.on('mouseout', this.onMouseOut);
  }

  public disableEdit() {
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseEnter);
    layer.off('mouseout', this.onMouseOut);
  }

  private onMouseEnter = (e: any) => {
    this.draw.setCursor('move');
    this.draw.editMode.enable();
  };
  private onMouseOut = (e: any) => {
    this.draw.resetCursor();
    this.draw.editMode.disable();
  };
  private onClick = (e: any) => {
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.DIRECT_SELECT);
    this.draw.selectMode.disable();
    // this.disableDrag();
    // this.draw.editMode.enable();
  };
}
