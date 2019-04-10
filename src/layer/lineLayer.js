import Layer from '../core/layer';
import DrawLine from './render/line/drawMeshLine';
import DrawArc from './render/line/drawArc';
import { LineBuffer } from '../geom/buffer/index';
export default class LineLayer extends Layer {
  shape(type) {
    this.shapeType = type;
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
    this.type = 'polyline';
    const layerData = this.layerData;
    const style = this.get('styleOptions');
    const animateOptions = this.get('animateOptions');
    const activeOption = this.get('activedOptions');
    const layerCfg = {
      zoom: this.scene.getZoom(),
      style,
      animateOptions,
      activeOption
    };
    const buffer = (this._buffer = new LineBuffer({
      layerData,
      shapeType: this.shapeType,
      style
    }));
    const { attributes } = buffer;
    if (this.shapeType === 'arc') {
      DrawArc(attributes, layerCfg, this);
    } else {
      DrawLine(attributes, layerCfg, this);
    }
  }
}
