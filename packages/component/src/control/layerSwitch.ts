import { ILayer } from '@antv/l7-core';
import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ControlOptionItem,
  ISelectControlOption,
} from './baseControl/selectControl';

export interface ILayerSwitchOption extends ISelectControlOption {
  layers: Array<ILayer | string>;
}

export { LayerSwitch };

export default class LayerSwitch extends SelectControl<ILayerSwitchOption> {
  protected get layers(): ILayer[] {
    const layerService = this.layerService;
    const { layers } = this.controlOption;
    if (Array.isArray(layers) && layers.length) {
      const layerInstances: ILayer[] = [];
      layers.forEach((layer) => {
        if (layer instanceof Object) {
          layerInstances.push(layer as ILayer);
        }
        if (typeof layer === 'string') {
          const targetLayer =
            layerService.getLayer(layer) || layerService.getLayerByName(layer);
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
    };
  }

  public getLayerVisible() {
    return this.layers
      .filter((layer) => {
        return layer.isVisible();
      })
      .map((layer) => {
        return layer.name;
      });
  }

  public getLayerOptions(): ControlOptionItem[] {
    return this.layers.map((layer: ILayer) => {
      return {
        text: layer.name,
        value: layer.name,
      };
    });
  }

  public setOptions(option: Partial<ILayerSwitchOption>) {
    const isLayerChange = this.checkUpdateOption(option, ['layers']);
    super.setOptions(option);
    if (isLayerChange) {
      this.selectValue = this.getLayerVisible();
      this.controlOption.options = this.getLayerOptions();
      this.popper.setContent(this.getPopperContent(this.controlOption.options));
    }
  }

  public onAdd(): HTMLElement {
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
    return true;
  }
}
