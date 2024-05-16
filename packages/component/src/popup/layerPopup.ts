import type { ILayer, IPopupOption, L7Container } from '@antv/l7-core';
import { DOM, lodashUtil } from '@antv/l7-utils';
import Popup from './popup';

type ElementType = DOM.ElementType;
const { get } = lodashUtil;
export type LayerField = {
  field: string;
  formatField?: ElementType | ((field: string, feature: any) => ElementType);
  formatValue?: ElementType | ((value: any, feature: any) => ElementType);
  getValue?: (feature: any) => any;
};

export type LayerPopupConfigItem = {
  layer: ILayer | string;
  fields?: Array<LayerField | string>;
  title?: ElementType | ((feature: any) => ElementType);
  customContent?: ElementType | ((feature: any) => ElementType);
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
   * 用于统计当前帧当中，layer 被点击的次数
   */
  protected layerClickCountByFrame = 0;
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

  public addTo(scene: L7Container) {
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
    const newOption = { ...option };
    const trigger = newOption.trigger || this.popupOption.trigger;
    const items = newOption.items || this.popupOption.items;
    const isEmptyItems = items?.length === 0;
    newOption.followCursor = trigger === 'hover' && !isEmptyItems;
    const isShow = this.isShow;
    super.setOptions(newOption);
    this.bindLayerEvent();
    if (isEmptyItems || !isShow) {
      this.hide();
    }
    return this;
  }

  protected getDefault(option: Partial<ILayerPopupOption>): ILayerPopupOption {
    const isHoverTrigger = option.trigger !== 'click';
    return {
      ...super.getDefault(option),
      trigger: 'hover',
      followCursor: isHoverTrigger,
      lngLat: {
        lng: 0,
        lat: 0,
      },
      offsets: [0, 10],
      closeButton: false,
      closeOnClick: true,
      autoClose: false,
      closeOnEsc: false,
    };
  }

  /**
   * 绑定对应的图层事件
   * @protected
   */
  protected bindLayerEvent() {
    const { trigger, closeOnClick } = this.popupOption;
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
        const onLayerClick = this.onLayerClick.bind(this, layer);
        layerInfo.onClick = onLayerClick;
        layer?.on('click', onLayerClick);

        const mapContainer = this.mapsService?.getMapContainer();
        if (mapContainer && closeOnClick) {
          mapContainer.addEventListener('click', this.onSceneClick);
        }
      }
      const source = layer?.getSource?.();
      const onSourceUpdate = this.onSourceUpdate.bind(this);
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
      const mapContainer = this.mapsService?.getMapContainer();
      if (mapContainer) {
        mapContainer.removeEventListener('click', this.onSceneClick);
      }
    });
  }

  protected onLayerMouseMove(layer: ILayer, e: any) {
    if (!this.isSameFeature(layer, e.featureId)) {
      const { title, content } = this.getLayerInfoFrag(layer, e);
      this.setDOMContent(content);
      this.setTitle(title);
      this.setDisplayFeatureInfo({
        layer,
        featureId: e.featureId,
      });
      this.show();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onLayerMouseOut(layer: ILayer, e: any) {
    this.setDisplayFeatureInfo(undefined);
    if (this.isShow) {
      this.hide();
    }
  }

  protected onLayerClick = (layer: ILayer, e: any) => {
    requestAnimationFrame(() => {
      if (this.popupOption.closeOnClick) {
        this.layerClickCountByFrame++;
      }
      if (this.isShow && this.isSameFeature(layer, e.featureId)) {
        this.hide();
      } else {
        const { title, content } = this.getLayerInfoFrag(layer, e);
        this.setDOMContent(content);
        this.setLnglat(e.lngLat);
        this.setTitle(title);
        this.setDisplayFeatureInfo({
          layer,
          featureId: e.featureId,
        });
        this.show();
      }
    });
  };

  protected onSceneClick = () => {
    this.layerClickCountByFrame = 0;
    requestAnimationFrame(() => {
      if (!this.layerClickCountByFrame) {
        this.hide();
      }
    });
  };

  protected onSourceUpdate() {
    this.hide();
    this.setDisplayFeatureInfo(undefined);
  }

  /**
   * 通过当前图层和对应选中的元素获取气泡展示的 HTML 内容
   * @param layer
   * @param e
   * @protected
   */
  protected getLayerInfoFrag(layer: ILayer, e: any) {
    const layerInfo = this.layerConfigMap.get(layer);
    let titleFrag: DocumentFragment | undefined;
    const contentFrag = document.createDocumentFragment();
    if (layerInfo) {
      let feature = e.feature;
      if (feature.type === 'Feature' && 'properties' in feature && 'geometry' in feature) {
        feature = feature.properties;
      }
      const { title, fields, customContent } = layerInfo;

      if (title) {
        titleFrag = document.createDocumentFragment();
        const titleElement = title instanceof Function ? title(feature) : title;
        DOM.appendElementType(titleFrag, titleElement);
      }

      if (customContent) {
        const content = customContent instanceof Function ? customContent(feature) : customContent;
        DOM.appendElementType(contentFrag, content);
      } else if (fields?.length) {
        fields?.forEach((fieldConfig) => {
          const { field, formatField, formatValue, getValue } =
            typeof fieldConfig === 'string'
              ? // tslint:disable-next-line:no-object-literal-type-assertion
                ({ field: fieldConfig } as LayerField)
              : fieldConfig;
          const row = DOM.create('div', 'l7-layer-popup__row');
          const value = getValue ? getValue(e.feature) : get(feature, field);

          const fieldElement =
            (formatField instanceof Function ? formatField(field, feature) : formatField) ?? field;

          let valueElement =
            (formatValue instanceof Function ? formatValue(value, feature) : formatValue) ?? value;

          const fieldSpan = DOM.create('span', 'l7-layer-popup__key', row);
          DOM.appendElementType(fieldSpan, fieldElement);
          DOM.appendElementType(fieldSpan, document.createTextNode('：'));

          const valueSpan = DOM.create('span', 'l7-layer-popup__value', row);

          // 当 value 中每项元素均为基础数据类型时，用逗号隔开
          if (
            Array.isArray(valueElement) &&
            valueElement.every((item) => !(item instanceof Object))
          ) {
            valueElement = valueElement.map((item) => String(item)).join(',');
          }
          DOM.appendElementType(valueSpan, valueElement);
          contentFrag.appendChild(row);
        });
      }
    }
    return {
      title: titleFrag,
      content: contentFrag,
    };
  }

  /**
   * 通过 Layer 配置访问到真实的 Layer 实例
   * @param configItem
   * @protected
   */
  protected getLayerByConfig(configItem: LayerPopupConfigItem): ILayer | undefined {
    const layer = configItem.layer;
    if (layer instanceof Object) {
      return layer;
    }
    if (typeof layer === 'string') {
      return this.layerService.getLayer(layer) || this.layerService.getLayerByName(layer);
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

  protected setDisplayFeatureInfo(displayFeatureInfo?: { layer: ILayer; featureId: number }) {
    const oldDisplayFeatureInfo = this.displayFeatureInfo;
    if (oldDisplayFeatureInfo) {
      oldDisplayFeatureInfo.layer.off('hide', this.onLayerHide);
    }
    if (displayFeatureInfo) {
      displayFeatureInfo.layer.on('hide', this.onLayerHide);
    }
    this.displayFeatureInfo = displayFeatureInfo;
  }

  protected onLayerHide = () => {
    this.hide();
    this.setDisplayFeatureInfo(undefined);
  };

  /**
   * 覆盖 Popup 中的默认的 closeOnClick 行为
   */
  // tslint:disable-next-line:no-empty
  protected updateCloseOnClick = () => {};
}
