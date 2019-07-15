import Layer from '../core/layer';
import { getRender } from './render';
export default class PolygonLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this.set('type', 'polygon');
  }
  shape(type) {
    this.shape = type;
    this.set('shape', type);
    this.set('shapeType', 'polygon');
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
PolygonLayer.type = 'polygon';
