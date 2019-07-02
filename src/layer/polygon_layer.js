import Layer from '../core/layer';
import { getRender } from './render';
export default class PolygonLayer extends Layer {
  shape(type) {
    this.shape = type;
    return this;
  }
  draw() {
    // this.init();
    this.type = 'polygon';
    const animateOptions = this.get('animateOptions');
    if (animateOptions.enable) {
      this.shape = 'animate';
    }
    this.add(getRender(this.type, this.shape)(this.layerData, this));
  }
  update() {
    this.updateFilter(this.layerMesh);
  }
}
