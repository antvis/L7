import { Feature, FeatureCollection } from '@turf/helpers';
import { DrawEvent, DrawModes } from '../util/constant';
import BaseRender from './base_render';
import { renderFeature } from './renderFeature';
export default class DrawResultLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    if (this.drawLayers.length > 0) {
      this.updateData(feature);
      return;
    }
    this.removeLayers();
    const style = this.draw.getStyle('normal');
    this.drawLayers = renderFeature(feature, style);
    this.addFilter();
    this.addLayers();
  }
  public enableSelect() {
    if (this.isEnableDrag) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.on('click', this.onClick);
    this.isEnableDrag = true;
  }
  public disableSelect() {
    if (!this.isEnableDrag) {
      return;
    }
    const layer = this.drawLayers[0];
    layer.off('click', this.onClick);
    this.isEnableDrag = false;
  }
  public enableDelete() {
    this.disableSelect();
    const layer = this.drawLayers[0];
    layer.on('click', this.onDeleteClick);
  }

  public disableDelete() {
    const layer = this.drawLayers[0];
    layer.off('click', this.onDeleteClick);
  }
  public addFilter() {
    this.drawLayers.forEach((layer) =>
      layer.filter('active', (active) => {
        return !active;
      }),
    );
  }
  private onClick = (e: any) => {
    this.draw.source.setFeatureUnActive(
      this.draw.getCurrentFeature() as Feature,
    );
    this.draw.setCurrentFeature(e.feature);
    this.draw.source.setFeatureActive(e.feature as Feature);
    this.updateData(this.draw.source.data);
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
  };

  private onDeleteClick = (e: any) => {
    this.draw.source.removeFeature(e.feature);
    this.updateData(this.draw.source.data);
  };
}
