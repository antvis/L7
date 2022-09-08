import { ILayer, IPopupOption } from '@antv/l7-core';
import { BaseLayer } from '@antv/l7-layers';
import { DOM } from '@antv/l7-utils';
import { Container } from 'inversify';
// import { Container } from 'inversify';
import Popup from './popup';

export type LayerField = {
  field: string;
  fieldFormat?: (field: string) => string;
  valueFormat?: (value: any) => string;
};

export type LayerPopupConfigFieldItem = {
  layer: BaseLayer | string;
  fields: Array<LayerField | string>;
};

export interface ILayerPopupOption extends IPopupOption {
  config: LayerPopupConfigFieldItem[];
  trigger: 'hover' | 'click';
}

type LayerMapInfo = {
  onMouseMove?: (layer: BaseLayer, e: any) => void;
  onMouseOut?: (layer: BaseLayer, e: any) => void;
  onClick?: (layer: BaseLayer, e: any) => void;
  onSourceUpdate?: (layer: BaseLayer) => void;
} & Partial<LayerPopupConfigFieldItem>;

export { LayerPopup };

export default class LayerPopup extends Popup<ILayerPopupOption> {
  /**
   * 用于保存图层对应的事件回调以及配置信息
   * @protected
   */
  protected layerConfigMap: WeakMap<ILayer, LayerMapInfo> = new WeakMap();

  /**
   * 当期正在展示的图层以及对应元素 id 的信息
   * @protected
   */
  protected displayFeatureInfo?: {
    layer: ILayer;
    featureId: number;
  };

  public addTo(scene: Container) {
    super.addTo(scene);
    this.bindLayerEvent();
    this.hide();
    return this;
  }

  public remove() {
    super.remove();
    this.unbindLayerEvent();
    return this;
  }

  public setOptions(option: Partial<ILayerPopupOption>) {
    this.unbindLayerEvent();
    super.setOptions(option);
    this.bindLayerEvent();
    return this;
  }

  protected getDefault(option: Partial<ILayerPopupOption>): ILayerPopupOption {
    const isClickTrigger = option.trigger === 'click';

    return {
      ...super.getDefault(option),
      trigger: 'hover',
      followCursor: !isClickTrigger,
      lngLat: {
        lng: 0,
        lat: 0,
      },
      offsets: [0, 10],
      closeButton: false,
      closeOnClick: false,
      autoClose: false,
      closeOnEsc: false,
    };
  }

  /**
   * 绑定对应的图层事件
   * @protected
   */
  protected bindLayerEvent() {
    const { config, trigger } = this.popupOption;
    config.forEach((configItem) => {
      const layer = this.getLayerByConfig(configItem);
      if (!layer) {
        return;
      }
      const layerInfo: LayerMapInfo = {
        ...configItem,
      };

      if (trigger === 'hover') {
        const onMouseMove = this.onLayerMouseMove.bind(this, layer);
        const onMouseOut = this.onLayerMouseOut.bind(this, layer);
        layerInfo.onMouseMove = onMouseMove;
        layerInfo.onMouseOut = onMouseOut;

        layer?.on('mousemove', onMouseMove);
        layer?.on('mouseout', onMouseOut);
      } else {
        const onClick = this.onLayerClick.bind(this, layer);
        layerInfo.onClick = onClick;

        layer?.on('click', onClick);
      }
      const source = layer.getSource();
      const onSourceUpdate = this.onSourceUpdate.bind(this, layer);
      source.on('update', onSourceUpdate);
      layerInfo.onSourceUpdate = onSourceUpdate;

      this.layerConfigMap.set(layer, layerInfo);
    });
  }

  /**
   * 解绑对应的图层事件
   * @protected
   */
  protected unbindLayerEvent() {
    const { config } = this.popupOption;
    config.forEach((configItem) => {
      const layer = this.getLayerByConfig(configItem);
      const layerInfo = layer && this.layerConfigMap.get(layer);
      if (!layerInfo) {
        return;
      }
      const { onMouseMove, onMouseOut, onClick, onSourceUpdate } = layerInfo;
      if (onMouseMove) {
        layer.off('mousemove', onMouseMove);
      }
      if (onMouseOut) {
        layer.off('mouseout', onMouseOut);
      }
      if (onClick) {
        layer.off('click', onClick);
      }
      if (onSourceUpdate) {
        layer?.getSource().off('update', onSourceUpdate);
      }
    });
  }

  protected onLayerMouseMove(layer: ILayer, e: any) {
    if (!this.isSameFeature(layer, e.featureId)) {
      const frag = this.getLayerInfoFrag(layer, e);
      this.setDOMContent(frag);
      this.displayFeatureInfo = {
        layer,
        featureId: e.featureId,
      };
    }

    if (!this.isShow) {
      this.show();
    }
  }

  protected onLayerMouseOut(layer: ILayer, e: any) {
    this.displayFeatureInfo = undefined;
    if (this.isShow) {
      this.hide();
    }
  }

  protected onLayerClick(layer: ILayer, e: any) {
    if (this.isShow && this.isSameFeature(layer, e.featureId)) {
      this.hide();
    } else {
      const frag = this.getLayerInfoFrag(layer, e);
      this.setDOMContent(frag);
      this.setLnglat(e.lngLat);
      this.show();
      this.displayFeatureInfo = {
        layer,
        featureId: e.featureId,
      };
    }
  }

  protected onSourceUpdate(layer: ILayer) {
    if (this.displayFeatureInfo?.layer === layer) {
      this.hide();
      this.displayFeatureInfo = undefined;
    }
  }

  /**
   * 通过当前图层和对应选中的元素获取气泡展示的 HTML 内容
   * @param layer
   * @param e
   * @protected
   */
  protected getLayerInfoFrag(layer: ILayer, e: any): DocumentFragment {
    const layerInfo = this.layerConfigMap.get(layer);
    const frag = document.createDocumentFragment();
    if (layerInfo) {
      let feature = e.feature;
      if (
        feature.type === 'Feature' &&
        'properties' in feature &&
        'geometry' in feature
      ) {
        feature = feature.properties;
      }
      const { fields } = layerInfo;
      fields?.forEach((fieldConfig) => {
        const { field, fieldFormat, valueFormat } =
          typeof fieldConfig === 'string'
            ? ({ field: fieldConfig } as any)
            : fieldConfig;
        const row = DOM.create('div', 'l7-layer-popup__row');
        const value = feature[field];
        row.innerHTML = `${fieldFormat ? fieldFormat(field) : field}: ${
          valueFormat ? valueFormat(value) : value
        }`;
        frag.appendChild(row);
      });
    }
    return frag;
  }

  /**
   * 通过 Layer 配置访问到真实的 Layer 实例
   * @param config
   * @protected
   */
  protected getLayerByConfig(
    config: LayerPopupConfigFieldItem,
  ): ILayer | undefined {
    const layer = config.layer;
    if (layer instanceof BaseLayer) {
      return layer;
    }
    if (typeof layer === 'string') {
      return (
        this.layerService.getLayer(layer) ||
        this.layerService.getLayerByName(layer)
      );
    }
  }

  /**
   * 判断当前展示的 Feature 是否和上一次查看的一致
   * @param layer
   * @param featureId
   * @protected
   */
  protected isSameFeature(layer: ILayer, featureId: number) {
    const displayFeatureInfo = this.displayFeatureInfo;
    return (
      displayFeatureInfo &&
      layer === displayFeatureInfo.layer &&
      featureId === displayFeatureInfo.featureId
    );
  }
}
