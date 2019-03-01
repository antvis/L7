import Layer from '../core/layer';
import gridBuffer from '../geom/buffer/heatmap/grid';
import DrawGrid from './render/heatmap/gird';
import DrawHexagon from './render/heatmap/hexagon';
import drawHeatmap from './render/heatmap/heatmap';
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
    const { radius } = this.layerSource.data;
    this._buffer = new hexagonBuffer(this.layerData);
    const config = {
      ...style,
      radius
    };
    const Mesh = new DrawHexagon(this._buffer, config);
    this.add(Mesh);
  }
  _drawGrid() {
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
