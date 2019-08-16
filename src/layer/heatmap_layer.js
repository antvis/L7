import Layer from '../core/layer';
import { getRender } from './render/';

export default class HeatMapLayer extends Layer {
  shape(type) {
    this.shapeType = type;
    return this;
  }
  draw() {
    this.type = 'heatmap';
    if (!this.shapeType) this.shapeType = 'heatmap';
    const renderType = this.shapeType === 'heatmap' ? 'heatmap' : 'shape';
    this.add(getRender('heatmap', renderType)(this.layerData, this, this.layerSource));
  }
}
