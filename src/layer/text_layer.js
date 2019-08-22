import Layer from '../core/layer';
import { getRender } from './render';
export default class TextLayer extends Layer {
  shape(field, values) {
    super.shape(field, values);
    this.shape = 'text';
    return this;
  }
  draw() {
    this.type = 'text';
    this.add(getRender(this.type, this.shape)(this.layerData, this));
  }
}
