import Layer from '../core/layer';
import * as drawPolygon from './render/polygon';
import PolygonBuffer from '../geom/buffer/polygon';
export default class PolygonLayer extends Layer {
  shape(type) {
    this.shape = type;
    return this;
  }
  draw() {
    this.init();
    this.type = 'polygon';
    this._buffer = new PolygonBuffer({
      shape: this.shape,
      layerData: this.layerData
    });
    this.add(this._getLayerRender());
  }
  update() {
    this.updateFilter(this.layerMesh);
  }
  _getLayerRender() {
    const animateOptions = this.get('animateOptions');
    const { attributes } = this._buffer;
    const style = this.get('styleOptions');
    const activeOption = this.get('activedOptions');
    const config = {
      ...style,
      activeColor: activeOption.fill
    };
    if (this.shape === 'line') {
      return drawPolygon.DrawLine(attributes, style);
    } else if (animateOptions.enable) {
      const { near, far } = this.map.getCameraState();
      this.scene.startAnimate();
      return drawPolygon.DrawAnimate(attributes, { ...style, near, far });
    }
    return drawPolygon.DrawFill(attributes, config);

  }

}
