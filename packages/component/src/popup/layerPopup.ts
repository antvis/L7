import { ILayer, IPopupOption } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { Container } from 'inversify';
import { get } from 'lodash';
// import { Container } from 'inversify';
import Popup from './popup';

export type LayerField = {
  field: string;
  formatField?: ((field: string) => string) | string;
  formatValue?: ((value: any) => any) | string;
  getValue?: (feature: any) => any;
};

export type LayerPopupConfigItem = {
  layer: ILayer | string;
  fields: Array<LayerField | string>;
};

export interface ILayerPopupOption extends IPopupOption {
  config?: LayerPopupConfigItem[];
  items?: LayerPopupConfigItem[];
  trigger: 'hover' | 'click';
}

type LayerMapInfo = {
  onMouseMove?: (layer: ILayer, e: any) => void;
  onMouseOut?: (layer: ILayer, e: any) => void;
  onClick?: (layer: ILayer, e: any) => void;
  onSourceUpdate?: (layer: ILayer) => void;
} & Partial<LayerPopupConfigItem>;

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

  protected get layerConfigItems() {
    const { config, items } = this.popupOption;
    return config ?? items ?? [];
  }

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
    const { trigger } = this.popupOption;
    this.layerConfigItems.forEach((configItem) => {
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
      const source = layer?.getSource?.();
      const onSourceUpdate = this.onSourceUpdate.bind(this, layer);
      source?.on('update', onSourceUpdate);
      layerInfo.onSourceUpdate = onSourceUpdate;

      this.layerConfigMap.set(layer, layerInfo);
    });
  }

  /**
   * 解绑对应的图层事件
   * @protected
   */
  protected unbindLayerEvent() {
    this.layerConfigItems.forEach((configItem) => {
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
        layer?.getSource()?.off('update', onSourceUpdate);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const { field, formatField, formatValue, getValue } =
          typeof fieldConfig === 'string'
            ? // tslint:disable-next-line:no-object-literal-type-assertion
              ({ field: fieldConfig } as LayerField)
            : fieldConfig;
        const row = DOM.create('div', 'l7-layer-popup__row');
        const value = getValue ? getValue(e.feature) : get(feature, field);

        const fieldText =
          (formatField instanceof Function
            ? formatField(field)
            : formatField) ?? field;
        const valueText =
          (formatValue instanceof Function
            ? formatValue(value)
            : formatValue) ?? value;
        row.innerHTML = `<span class="l7-layer-popup__key">${fieldText}</span>: <span class="l7-layer-popup__value">${valueText}</span>`;
        frag.appendChild(row);
      });
    }
    return frag;
  }

  /**
   * 通过 Layer 配置访问到真实的 Layer 实例
   * @param configItem
   * @protected
   */
  protected getLayerByConfig(
    configItem: LayerPopupConfigItem,
  ): ILayer | undefined {
    const layer = configItem.layer;
    if (layer instanceof Object) {
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
