import {
  ILayer,
  IPopup,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
  StyleAttrField,
} from '@antv/l7';
import { EventEmitter } from 'eventemitter3';
// @ts-ignore
import geobuf from 'geobuf';
// tslint:disable-next-line: no-submodule-imports
import isObject from 'lodash/isObject';
// tslint:disable-next-line: no-submodule-imports
import mergeWith from 'lodash/mergeWith';
// @ts-ignore
import Pbf from 'pbf';
import { AttributeType, IDistrictLayerOption } from './interface';

function mergeCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}
export default class BaseLayer extends EventEmitter {
  public fillLayer: ILayer;
  public lineLayer: ILayer;
  public labelLayer: ILayer;
  public bubbleLayer: ILayer;
  protected scene: Scene;
  protected options: IDistrictLayerOption;
  protected layers: ILayer[] = [];
  protected fillData: any;
  private popup: IPopup;

  constructor(scene: Scene, option: Partial<IDistrictLayerOption> = {}) {
    super();
    this.scene = scene;
    this.options = mergeWith(this.getDefaultOption(), option, mergeCustomizer);
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

  public setOption(newOption: { [key: string]: any }) {
    this.options = mergeWith(this.options, newOption);
  }

  public updateData(
    newData: Array<{ [key: string]: any }>,
    joinByField?: [string, string],
  ) {
    this.setOption({
      data: newData,
      joinBy: joinByField,
    });
    const { data = [], joinBy } = this.options;
    this.fillLayer.setData(this.fillData, {
      transforms:
        data.length === 0
          ? []
          : [
              {
                type: 'join',
                sourceField: joinBy[1], // data1 对应字段名
                targetField: joinBy[0], // data 对应字段名 绑定到的地理数据
                data,
              },
            ],
    });
  }
  protected async fetchData(data: { url: any; type: string }) {
    if (data.type === 'pbf') {
      const buffer = await (await fetch(data.url)).arrayBuffer();
      const geojson = geobuf.decode(new Pbf(buffer));
      return geojson;
    } else {
      return isObject(data.url) ? data.url : (await fetch(data.url)).json();
    }
  }
  protected getDefaultOption(): IDistrictLayerOption {
    return {
      zIndex: 0,
      depth: 1,
      adcode: [],
      joinBy: ['name', 'name'],
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
      bubble: {
        enable: false,
        shape: 'circle',
        color: '#1AA9FF',
        size: 15,
        style: {
          opacity: 1,
          stroke: '#fff',
          strokeWidth: 1,
        },
      },
      fill: {
        scale: null,
        color: '#ddd',
        style: {
          opacity: 1.0,
        },
        activeColor: 'rgba(0,0,255,0.3)',
      },
      autoFit: true,
      stroke: '#bdbdbd',
      strokeWidth: 0.6,
      cityStroke: '#636363',
      cityStrokeWidth: 0.6,
      countyStrokeWidth: 0.6,
      provinceStrokeWidth: 0.6,
      provinceStroke: '#f0f0f0',
      countyStroke: '#525252',
      coastlineStroke: '#4190da',
      coastlineWidth: 0.6,
      nationalStroke: '#c994c7',
      nationalWidth: 0.5,
      chinaNationalStroke: 'gray',
      chinaNationalWidth: 1,
      popup: {
        enable: true,
        openTriggerEvent: 'mouseenter',
        closeTriggerEvent: 'mouseout',
        option: {},
        Html: (properties: any) => {
          return `${properties.name}`;
        },
      },
    };
  }

  protected addFillLayer(fillCountry: any) {
    // 添加省份填充
    const { popup, data = [], fill, autoFit, joinBy } = this.options;
    this.fillData = fillCountry;
    const fillLayer = new PolygonLayer({
      autoFit,
    }).source(fillCountry, {
      transforms:
        data.length === 0
          ? []
          : [
              {
                type: 'join',
                sourceField: joinBy[1], // data1 对应字段名
                targetField: joinBy[0], // data 对应字段名 绑定到的地理数据
                data,
              },
            ],
    });
    this.setLayerAttribute(fillLayer, 'color', fill.color as AttributeType);
    if (fill.scale && isObject(fill.color)) {
      fillLayer.scale('color', {
        type: fill.scale,
        field: fill.color.field as string,
      });
    }
    fillLayer
      .shape('fill')
      .active({
        color: fill.activeColor as string,
      })
      .style(fill.style);
    this.fillLayer = fillLayer;
    this.layers.push(fillLayer);
    this.scene.addLayer(fillLayer);
    if (this.options.bubble && this.options.bubble?.enable !== false) {
      const labeldata = fillCountry.features.map((feature: any) => {
        return {
          ...feature.properties,
          center: [feature.properties.x, feature.properties.y],
        };
      });
      this.addBubbleLayer(labeldata);
    }
    if (popup.enable) {
      this.addPopup();
    }

    this.emit('loaded');
  }

  protected addFillLine(provinceLine: any) {
    const { stroke, strokeWidth, zIndex } = this.options;
    const layer2 = new LineLayer({
      zIndex: zIndex + 0.1,
    })
      .source(provinceLine)
      .color(stroke)
      .size(strokeWidth)
      .style({
        opacity: 1,
      });
    this.scene.addLayer(layer2);
    this.layers.push(layer2);
    this.lineLayer = layer2;
  }

  protected addLabelLayer(labelData: any, type: string = 'json') {
    const labelLayer = this.addLabel(labelData, type);
    this.scene.addLayer(labelLayer);
    this.layers.push(labelLayer);
    this.labelLayer = labelLayer;
  }

  protected addBubbleLayer(labelData: any, type: string = 'json') {
    const { bubble, zIndex, data = [], joinBy } = this.options;
    const bubbleLayer = new PointLayer({
      zIndex: zIndex + 0.3,
    }).source(labelData, {
      parser: {
        type,
        coordinates: 'center',
      },
      transforms:
        data.length === 0
          ? []
          : [
              {
                type: 'join',
                sourceField: joinBy[1], // data1 对应字段名
                targetField: joinBy[0], // data 对应字段名 绑定到的地理数据
                data,
              },
            ],
    });
    this.setLayerAttribute(bubbleLayer, 'color', bubble.color as AttributeType);
    this.setLayerAttribute(bubbleLayer, 'size', bubble.size as AttributeType);
    this.setLayerAttribute(bubbleLayer, 'shape', bubble.shape as AttributeType);
    if (bubble.scale) {
      bubbleLayer.scale(bubble.scale.field, {
        type: bubble.scale.type,
      });
    }
    bubbleLayer.style(bubble.style);
    this.scene.addLayer(bubbleLayer);
    this.layers.push(bubbleLayer);
    this.bubbleLayer = bubbleLayer;
    return bubbleLayer;
  }

  protected addLabel(labelData: any, type: string = 'json') {
    const { label, zIndex } = this.options;
    const labelLayer = new PointLayer({
      zIndex: zIndex + 0.4,
    })
      .source(labelData, {
        parser: {
          type,
          coordinates: 'center',
        },
      })
      .color(label.color as StyleAttrField)
      .shape(label.field as StyleAttrField, 'text')
      .size(10)
      .style({
        opacity: label.opacity,
        stroke: label.stroke,
        strokeWidth: label.strokeWidth,
        textAllowOverlap: label.textAllowOverlap,
      });
    return labelLayer;
  }

  protected addPopup() {
    const { popup } = this.options;
    let popupLayer;
    if (popup.triggerLayer) {
      popupLayer =
        popup.triggerLayer === 'bubble' ? this.bubbleLayer : this.fillLayer;
    } else {
      popupLayer = this.options.bubble.enable
        ? this.bubbleLayer
        : this.fillLayer;
    }
    popupLayer.on(popup.openTriggerEvent as string, (e) => {
      const html = popup.Html
        ? popup.Html(e.feature.properties ? e.feature.properties : e.feature)
        : '';
      this.popup = new Popup({
        closeButton: false,
        ...popup.option,
      })
        .setLnglat(e.lngLat)
        .setHTML(html);
      this.scene.addPopup(this.popup);
    });

    popupLayer.on(popup.closeTriggerEvent as string, (e) => {
      this.popup.remove();
    });
  }

  private setLayerAttribute(
    layer: ILayer,
    type: 'color' | 'size' | 'shape',
    attr: AttributeType,
  ) {
    if (isObject(attr)) {
      layer[type](attr.field, attr.values);
    } else {
      layer[type](attr);
    }
  }
}
