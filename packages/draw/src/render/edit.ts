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
import { Feature } from '@turf/helpers';
import Draw from '../modes/draw_feature';
export default class EditRenderLayer {
  private polygonLayer: ILayer;
  private lineLayer: ILayer;
  private centerLayer: ILayer;
  private endPointLayer: ILayer;
  private draw: Draw;
  private currentFeature: Feature;
  constructor(draw: Draw) {
    this.draw = draw;
    this.init();
  }
  public init() {
    const style = this.draw.getStyle('active_fill');
    const linestyle = this.draw.getStyle('active_line');
    const centerStyle = this.draw.getStyle('active_point');
    this.polygonLayer = new PolygonLayer()
      .source(InitFeature)
      .shape('fill')
      .color(style.color)
      .style(style.style);

    this.lineLayer = new LineLayer()
      .source(InitFeature)
      .shape('line')
      .size(linestyle.size)
      .color(linestyle.color)
      .style(linestyle.style);
    this.centerLayer = new PointLayer({
      zIndex: 3,
      blend: 'normal',
    })
      .source([], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .color(centerStyle.color)
      .size(centerStyle.size)
      .style(centerStyle.style);
    this.endPointLayer = new PointLayer({
      zIndex: 4,
      blend: 'normal',
    })
      .source([], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .color(centerStyle.color)
      .size(centerStyle.size)
      .style(centerStyle.style);

    this.draw.scene.addLayer(this.polygonLayer);
    this.draw.scene.addLayer(this.lineLayer);
    this.draw.scene.addLayer(this.centerLayer);
    this.draw.scene.addLayer(this.endPointLayer);
    this.addLayerEvent();
  }
  public updateData(data: any) {
    this.currentFeature = data.features[0];
    this.lineLayer.setData(data);
    this.polygonLayer.setData(data);
    this.centerLayer.setData([data.features[0].properties.center]);
    this.endPointLayer.setData([data.features[0].properties.endPoint]);
  }

  public destroy() {
    this.draw.scene.removeLayer(this.lineLayer);
    this.draw.scene.removeLayer(this.polygonLayer);
    this.draw.scene.removeLayer(this.centerLayer);
    this.draw.scene.removeLayer(this.endPointLayer);
  }

  private addLayerEvent() {
    this.endPointLayer.on('mousemove', (e) => {
      this.draw.setCursor('move');
      this.draw.enable();
    });
    this.endPointLayer.on('unmousemove', (e) => {
      this.draw.resetCursor();
      this.draw.disable();
    });
  }
}
