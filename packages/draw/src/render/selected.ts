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
import { DrawEvent, DrawModes } from '../util/constant';
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
  }

  public updateData(data: any) {
    if (this.currentFeature === undefined) {
      this.addLayerEvent();
    }
    this.currentFeature = data.features[0];
    this.lineLayer.setData(data);
    this.polygonLayer.setData(data);
    const properties = data.features[0].properties;
    if (properties.startPoint) {
      this.centerLayer.setData([
        {
          lng: properties.startPoint[0],
          lat: properties.startPoint[1],
        },
      ]);
    }
    if (properties.endPoint) {
      this.endPointLayer.setData([
        {
          lng: properties.endPoint[0],
          lat: properties.endPoint[1],
        },
      ]);
    }
  }

  public destroy() {
    this.draw.scene.removeLayer(this.lineLayer);
    this.draw.scene.removeLayer(this.polygonLayer);
    // this.draw.scene.removeLayer(this.centerLayer);
  }

  public show() {
    this.lineLayer.show();
    this.polygonLayer.show();
    // this.centerLayer.show();
  }

  public hide() {
    this.lineLayer.hide();
    this.polygonLayer.hide();
    // this.centerLayer.hide();
  }
  private addLayerEvent() {
    this.polygonLayer.on('mousemove', (e) => {
      this.draw.setCursor('move');
      this.draw.selectMode.enable();
    });
    this.polygonLayer.on('unmousemove', (e) => {
      this.draw.resetCursor();
      this.draw.selectMode.disable();
    });

    this.polygonLayer.on('click', (e) => {
      // 进入编辑态
      this.draw.selectMode.disable();
      this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.DIRECT_SELECT);
      this.hide();
    });
    this.polygonLayer.on('unclick', (e) => {
      // 取消选中 回到初始态
      this.draw.emit(DrawEvent.MODE_CHANGE, DrawModes.STATIC);
      this.draw.selectMode.disable();
      this.hide();
    });
  }
}
