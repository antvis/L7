import { FeatureCollection } from '@turf/helpers';
import BaseRender from './base_render';
import { renderFeature } from './renderFeature';
export default class DrawVertexLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('active');
    this.drawLayers = renderFeature(feature, style);
    this.addLayers();
  }
  public enableDrag() {
    return;
  }
  public disableDrag() {
    return;
  }

  public enableEdit() {
    if (this.isEnableEdit) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseEnter);
    layer.on('mouseout', this.onMouseOut);
    layer.on('click', this.onClick);
    this.isEnableEdit = true;
  }

  public disableEdit() {
    if (!this.isEnableEdit) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseEnter);
    layer.off('mouseout', this.onMouseOut);
    layer.off('click', this.onClick);
    this.isEnableEdit = false;
  }

  private onMouseEnter = (e: any) => {
    this.draw.setCursor('move');
    this.draw.setCurrentVertex(e.feature);
    this.draw.editMode.enable();
  };
  private onMouseOut = (e: any) => {
    this.draw.resetCursor();
    this.draw.editMode.disable();
  };
  private onClick = (e: any) => {
    this.draw.setCurrentVertex(e.feature);
    this.draw.editMode.enable();
  };
}
