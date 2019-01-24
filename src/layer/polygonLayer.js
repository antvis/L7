import Layer from '../core/layer';
import * as drawPolygon from './render/polygon';
import PolygonBuffer from '../geom/buffer/polygon';
export default class PolygonLayer extends Layer {
  shape(type) {
    this.shape = type;
    return this;
  }
  render() {
    if (!this._hasRender) { // 首次渲染
      this._hasRender = true;
      this._prepareRender();
    } else {

      this._initAttrs();
      (this._needUpdateFilter || this._needUpdateColor) ? this._updateFilter(this.layerMesh) : null;
      // TODO update Style;
    }
    return this;
  }
  _prepareRender() {
    this.init();
    this.type = 'polygon';
    const source = this.layerSource;
    this._buffer = new PolygonBuffer({
      shape: this.shape,
      coordinates: source.geoData,
      properties: this.StyleData
    });
    this.add(this._getLayerRender());
  }
  update() {
    this.updateFilter(this.layerMesh);
    // 动态更新相关属性
  }
  _getLayerRender() {
    const animateOptions = this.get('animateOptions');
    const { attributes } = this._buffer;
    const style = this.get('styleOptions');
    if (this.shape === 'line') {
      return drawPolygon.DrawLine(attributes, style);
    } else if (animateOptions.enable) {
      const { near, far } = this.map.getCameraState();
      return drawPolygon.DrawAnimate(attributes, { ...style, near, far });
    }
    return drawPolygon.DrawFill(attributes, style);

  }

}
