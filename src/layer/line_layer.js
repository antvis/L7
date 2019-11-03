import Layer from '../core/layer';
import { getRender } from './render';
export default class LineLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this.set('type', 'line');
  }
  shape(field, values) {
    super.shape(field, values);
    this.shapeType = field;
    this.set('shape', field);
    return this;
  }
  preRender() {
    if (
      this.animateDuration > 0 &&
      this.animateDuration < this.scene._engine.clock.getElapsedTime()
    ) {
      this.layerMesh.material.setDefinesvalue('ANIMATE', false);
      this.scene.stopAnimate();
      this.emit('animateEnd');
      this.animateDuration = Infinity;
    }
  }
  draw() {
    this.type = 'line';
    this.add(getRender('line', this.shapeType || 'line')(this.layerData, this));
  }
}
LineLayer.type = 'line';
