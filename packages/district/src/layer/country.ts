import {
  ILayer,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
} from '@antv/l7';
import merge from 'lodash/merge';
import fillCountry from '../data/country';
import labelData from '../data/label';
import { boundaries, boundaries2, island } from '../data/line';
import provinceLine from '../data/provinceline';
import { IDistrictLayerOption } from './interface';

export default class CountryLayer {
  private scene: Scene;
  private options: IDistrictLayerOption;
  private layers: ILayer[] = [];
  private fillLayer: ILayer;
  constructor(scene: Scene, option: Partial<IDistrictLayerOption> = {}) {
    this.scene = scene;
    this.options = merge(this.getdefaultOption(), option);
    this.addNationBorder();
    this.addFillLayer();
    if (this.options.label?.enable) {
      this.addLableLayer();
    }
  }

  public destroy() {
    this.layers.forEach((layer) => this.scene.removeLayer(layer));
    this.layers.length = 0;
  }

  public show() {
    this.layers.forEach((layer) => layer.show());
  }
  public hide() {
    this.layers.forEach((layer) => layer.hide());
  }
  private getdefaultOption(): IDistrictLayerOption {
    return {
      zIndex: 0,
      depth: 1,
      label: {
        enable: true,
        color: '#000',
        field: 'name',
        size: 8,
        stroke: '#fff',
        strokeWidth: 2,
        textAllowOverlap: true,
        opacity: 1,
      },
      fill: {
        scale: null,
        field: null,
        values: '#fff',
      },
      stroke: '#d95f0e',
      strokeWidth: 0.6,
      coastlineStroke: '#4190da',
      coastlineWidth: 1,
      nationalStroke: 'gray',
      nationalWidth: 1,
      popup: {
        enable: true,
        triggerEvent: 'mousemove',
      },
    };
  }
  // 添加行政区边界
  private addNationBorder() {
    const {
      nationalStroke,
      nationalWidth,
      coastlineStroke,
      coastlineWidth,
      zIndex,
    } = this.options;
    // 添加国界线
    const lineLayer = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries)
      .color('type', (v: number) => {
        return v * 1 === 0 ? coastlineWidth : nationalWidth;
      })
      .shape('line')
      .color('type', (v: number) => {
        return v * 1 === 0 ? coastlineStroke : nationalStroke;
      });
    // 添加未定国界
    const lineLayer2 = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries2)
      .size(1)
      .shape('line')
      .color('gray')
      .style({
        lineType: 'dash',
        dashArray: [2, 2],
      });

    // 添加岛屿填充
    const fillLayer1 = new PolygonLayer()
      .source(island)
      .color(coastlineStroke)
      .shape('fill')
      .style({
        opacity: 1,
      });
    // 添加岛屿填充
    const fillLayer2 = new LineLayer()
      .source(island)
      .color(coastlineStroke)
      .shape('line')
      .size(1)
      .style({
        opacity: 1,
      });
    this.scene.addLayer(lineLayer);
    this.scene.addLayer(lineLayer2);
    this.scene.addLayer(fillLayer1);
    this.scene.addLayer(fillLayer2);
    this.layers.push(lineLayer, lineLayer2, fillLayer1, fillLayer2);
  }

  private addFillLayer() {
    // 添加省份填充
    const { stroke, strokeWidth, popup, data = [], fill } = this.options;
    const fillLayer = new PolygonLayer().source(fillCountry, {
      transforms: [
        {
          type: 'join',
          sourceField: 'name', // data1 对应字段名
          targetField: 'name', // data 对应字段名 绑定到的地理数据
          data,
        },
      ],
    });
    fill.field
      ? fillLayer.color(fill.field, fill.values)
      : fillLayer.color(fill.values as string);

    if (fill.scale) {
      fillLayer.scale('color', {
        type: 'quantile',
        field: fill.field as string,
      });
    }
    fillLayer
      .shape('fill')
      .active({
        color: 'rgba(0,0,255,0.3)',
      })
      .style({
        opacity: 1,
      });
    this.fillLayer = fillLayer;
    // 添加省份边界
    const layer2 = new LineLayer({
      zIndex: 2,
    })
      .source(provinceLine)
      .color(stroke)
      .size(strokeWidth)
      .style({
        opacity: 1,
      });
    this.scene.addLayer(fillLayer);
    this.scene.addLayer(layer2);
    this.layers.push(fillLayer, layer2);
    if (popup.enable) {
      this.addPopup();
    }
  }

  private addLableLayer() {
    const { label, zIndex } = this.options;
    const labelLayer = new PointLayer({
      zIndex: zIndex + 2,
    })
      .source(labelData, {
        parser: {
          type: 'json',
          coordinates: 'center',
        },
      })
      .color(label.color)
      .shape(label.field, 'text')
      .size(10)
      .style({
        opacity: label.opacity,
        stroke: label.stroke,
        strokeWidth: label.strokeWidth,
        textAllowOverlap: label.textAllowOverlap,
      });
    this.scene.addLayer(labelLayer);
    this.layers.push(labelLayer);
  }
  private addPopup() {
    this.fillLayer.on('mousemove', (e) => {
      const popup = new Popup({
        closeButton: false,
      })
        .setLnglat(e.lngLat)
        .setHTML(`<span>省份: ${e.feature.properties.name}</span>`);
      this.scene.addPopup(popup);
    });
  }
}
