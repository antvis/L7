import Layer from '../core/layer';
import { getRender } from './render/';

export default class HeatMapLayer extends Layer {
  shape(type) {
    this.shapeType = type;
    return this;
  }
  draw() {
    this.type = 'heatmap';
    this.add(getRender('heatmap', this.shapeType || 'heatmap')(this.layerData, this, this.layerSource));
  }
}
