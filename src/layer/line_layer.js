import Layer from '../core/layer';
import { getRender } from './render';
export default class LineLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this.set('type', 'line');
  }
  shape(type) {
    this.shapeType = type;
    this.set('shape', type);
    return this;
  }
  preRender() {
    if (
      this.animateDuration > 0 &&
      this.animateDuration < this.scene._engine.clock.getElapsedTime()
    ) {
      this.layerMesh.material.setDefinesvalue('ANIMATE', false);
      this.emit('animateEnd');
      this.scene.stopAnimate();
      this.animateDuration = Infinity;
    }
  }
  draw() {
    this.type = 'line';
    this.add(getRender('line', this.shapeType || 'line')(this.layerData, this));
  }
}
LineLayer.type = 'line';
