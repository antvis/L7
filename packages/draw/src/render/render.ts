import {
  IInteractionTarget,
  ILayer,
  ILngLat,
  IPopup,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
} from '@antv/l7';
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
import Draw from '../modes/draw_mode';
import { DrawEvent, DrawModes } from '../util/constant';
export default class RenderLayer {
  private polygonLayer: ILayer;
  private lineLayer: ILayer;
  private draw: Draw;
  constructor(draw: Draw) {
    this.draw = draw;
    this.init();
  }
  public init() {
    const style = this.draw.getStyle('normal_fill');
    const linestyle = this.draw.getStyle('normal_line');
    this.polygonLayer = new PolygonLayer({
      zIndex: 0,
    })
      .source(InitFeature)
      .filter('active', (active) => {
        return !active;
      })
      .shape('fill')
      .active(true)
      .color(style.color)
      .style(style.style);

    this.lineLayer = new LineLayer({
      zIndex: 1,
    })
      .source(InitFeature)
      .shape('line')
      .filter('active', (active) => {
        return !active;
      })
      .size(linestyle.size)
      .color(linestyle.color)
      .style(linestyle.style);
    this.draw.scene.addLayer(this.polygonLayer);
    this.draw.scene.addLayer(this.lineLayer);
    this.addLayerEvent();
  }
  public updateData() {
    this.lineLayer.setData(this.draw.source.data);
    this.polygonLayer.setData(this.draw.source.data);
  }

  public destroy() {
    this.draw.scene.removeLayer(this.lineLayer);
    this.draw.scene.removeLayer(this.polygonLayer);
  }

  public show() {
    this.lineLayer.show();
    this.polygonLayer.show();
  }

  public hide() {
    this.lineLayer.hide();
    this.polygonLayer.hide();
  }

  private addLayerEvent() {
    this.polygonLayer.on('click', (e) => {
      this.draw.setCurrentFeature(e.feature);
      this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.SIMPLE_SELECT);
    });
  }
}
