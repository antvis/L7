import type { ILayer } from '@antv/l7-core';
import { createL7Icon } from '../utils/icon';
import type { ControlOptionItem, ISelectControlOption } from './baseControl/selectControl';
import SelectControl from './baseControl/selectControl';

export type LayerSwitchItem = {
  layer: ILayer;
  name?: string;
  img?: string;
};

export interface ILayerSwitchOption extends ISelectControlOption {
  layers: Array<ILayer | string | LayerSwitchItem>;
  multiple: boolean; // 是否多选，默认为true
}

export { LayerSwitch };

function isLayerSwitchItem(obj: any): obj is LayerSwitchItem {
  return Object.keys(obj ?? {}).every((key) => ['layer', 'name', 'img'].includes(key));
}

export default class LayerSwitch extends SelectControl<ILayerSwitchOption> {
  protected get layers(): ILayer[] {
    const layerService = this.layerService;
    const { layers } = this.controlOption;
    if (Array.isArray(layers) && layers.length) {
      const layerInstances: ILayer[] = [];

      layers.forEach((layer) => {
        if (layer instanceof Object) {
          if (isLayerSwitchItem(layer)) {
            layerInstances.push(layer.layer as ILayer);
          } else {
            layerInstances.push(layer as ILayer);
          }
        }
        if (typeof layer === 'string') {
          const targetLayer = layerService.getLayer(layer) || layerService.getLayerByName(layer);
          if (targetLayer) {
            layerInstances.push(targetLayer);
          }
        }
      });

      return layerInstances;
    }
    return layerService.getLayers() || [];
  }

  public getDefault(option?: Partial<ILayerSwitchOption>): ILayerSwitchOption {
    return {
      ...super.getDefault(option),
      title: '图层控制',
      btnIcon: createL7Icon('l7-icon-layer'),
      options: [],
      multiple: option?.multiple ?? true,
    };
  }

  public getLayerVisible() {
    return this.layers.filter((layer) => layer.isVisible()).map((layer) => layer.name);
  }

  public getLayerOptions(): ControlOptionItem[] {
    const { layers } = this.controlOption;
    const isAllImg = layers?.every((item: any) => item.img);
    if (layers) {
      return layers?.map((layer: any) => {
        if (isLayerSwitchItem(layer)) {
          return {
            text: layer.name || layer.layer.name,
            value: layer.layer.name,
            img: isAllImg ? layer.img : undefined,
          };
        } else if (typeof layer === 'string') {
          const targetLayer =
            this.layerService.getLayer(layer) || this.layerService.getLayerByName(layer);
          return {
            text: targetLayer?.name,
            value: targetLayer?.name,
          };
        }
        return {
          text: layer.name,
          value: layer.name,
        };
      }) as ControlOptionItem[];
    }
    return this.layers.map((layer: ILayer) => {
      return {
        text: layer.name,
        value: layer.name,
      };
    });
  }

  public setOptions(option: Partial<ILayerSwitchOption>) {
    const isLayerChange = this.checkUpdateOption(option, ['layers', 'multiple']);
    super.setOptions(option);
    if (isLayerChange) {
      if (this.controlOption.multiple === false) {
        this.handleSingleSelection();
      }
      this.selectValue = this.getLayerVisible();
      this.controlOption.options = this.getLayerOptions();
      this.popper.setContent(this.getPopperContent(this.controlOption.options));
    }
  }

  // TODO: 单选模式下，目前默认展示第一项，通过用户提供defaultValue展示默认选项的属性待开发
  // 如果是单选模式，则只显示第一个图层
  private handleSingleSelection() {
    this.layers.forEach((layer, index) => {
      index === 0 ? layer.show() : layer.hide();
    });
  }

  public onAdd(): HTMLElement {
    if (this.controlOption.multiple === false) {
      this.handleSingleSelection();
    }

    if (!this.controlOption.options?.length) {
      this.controlOption.options = this.getLayerOptions();
    }

    if (!this.controlOption.defaultValue) {
      this.controlOption.defaultValue = this.getLayerVisible();
    }

    this.on('selectChange', this.onSelectChange);
    this.layerService.on('layerChange', this.onLayerChange);
    return super.onAdd();
  }

  public onRemove() {
    this.off('selectChange', this.onSelectChange);
    this.layerService.off('layerChange', this.onLayerChange);
  }

  protected onLayerChange = () => {
    if (this.controlOption.layers?.length) {
      return;
    }
    this.selectValue = this.getLayerVisible();
    this.setOptions({
      options: this.getLayerOptions(),
    });
  };

  protected onLayerVisibleChane = () => {
    this.setSelectValue(this.getLayerVisible());
  };

  protected onSelectChange = () => {
    this.layers.forEach((layer) => {
      const needShow = this.selectValue.includes(layer.name);
      const isShow = layer.isVisible();
      if (needShow && !isShow) {
        layer.show();
      }
      if (!needShow && isShow) {
        layer.hide();
      }
    });
  };

  protected getIsMultiple(): boolean {
    return this.controlOption.multiple;
  }
}
