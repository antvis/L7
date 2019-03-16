import Layer from '../core/layer';
import gridBuffer from '../geom/buffer/heatmap/grid';
import DrawGrid from './render/heatmap/gird';
import DrawHexagon from './render/heatmap/hexagon';
import { drawHeatmap, updateIntensityPass } from './render/heatmap/heatmap';
import hexagonBuffer from '../geom/buffer/heatmap/hexagon';

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
    switch (this.shapeType) {
      case 'grid' :
        this._drawGrid();
        break;
      case 'hexagon' :
        this._drawHexagon();
        break;
      default:
        drawHeatmap(this);
    }
  }
  _drawHexagon() {
    const style = this.get('styleOptions');
    const activeOption = this.get('activedOptions');
    const { radius } = this.layerSource.data;
    this._buffer = new hexagonBuffer(this.layerData);
    const config = {
      ...style,
      radius,
      activeColor: activeOption.fill
    };
    const Mesh = new DrawHexagon(this._buffer, config);
    this.add(Mesh);
  }
  _drawGrid() {
    const style = this.get('styleOptions');
    const activeOption = this.get('activedOptions');
    const { xOffset, yOffset } = this.layerSource.data;
    this._buffer = new gridBuffer(this.layerData);
    const config = {
      ...style,
      xOffset,
      yOffset,
      activeColor: activeOption.fill
    };
    const girdMesh = new DrawGrid(this._buffer, config);
    this.add(girdMesh);
  }

  afterRender() {
    if (this.shapeType !== 'grid' && this.shapeType !== 'hexagon') {
     // updateIntensityPass(this);
    }
  }

}
