import Layer from '../core/layer';
import gridBuffer from '../geom/buffer/heatmap/grid';
import DrawGrid from './render/heatmap/gird';

export default class HeatMapLayer extends Layer {
  shape(type) {
    this.shapeType = type;
    return this;
  }
  render() {
    this._prepareRender();
    return this;
  }
  _prepareRender() {
    this.init();
    this.type = 'heatmap';
    const style = this.get('styleOptions');
    const { xOffset, yOffset } = this.layerSource.data;
    this._buffer = new gridBuffer(this.layerData);
    const config = {
      ...style,
      xOffset,
      yOffset
    };
    const girdMesh = new DrawGrid(this._buffer, config);
    this.add(girdMesh);
  }
}
