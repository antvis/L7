import { FeatureCollection } from '@turf/helpers';
import { DrawEvent, DrawModes } from '../util/constant';
import BaseRender from './base_render';
import { renderFeature } from './renderFeature';
export default class DrawResultLayer extends BaseRender {
  public update(feature: FeatureCollection) {
    this.removeLayers();
    const style = this.draw.getStyle('normal');
    this.drawLayers = renderFeature(feature, style);
    this.addFilter();
    this.addLayers();
  }
  public enableDrag() {
    const layer = this.drawLayers[0];
    layer.on('click', this.onClick);
  }
  public disableDrag() {
    const layer = this.drawLayers[0];
    layer.off('click', this.onClick);
  }
  public addFilter() {
    this.drawLayers.forEach((layer) =>
      layer.filter('active', (active) => {
        return !active;
      }),
    );
  }
  private onClick = (e: any) => {
    this.draw.setCurrentFeature(e.feature);
    this.draw.source.setFeatureActive(e.feature);
    this.update(this.draw.source.data);
    this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
  };
}
