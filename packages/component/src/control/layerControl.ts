import { ILayer } from '@antv/l7-core';
import { debounce } from 'lodash';
import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ISelectControlOption,
  OptionItem,
} from './baseControl/selectControl';

export interface ILayerControlOption extends ISelectControlOption {
  layers: ILayer[];
}

export { LayerControl };

export default class LayerControl extends SelectControl<ILayerControlOption> {
  protected get layers() {
    return this.controlOption.layers || this.layerService.getLayers();
  }

  public onSelectChange = debounce(() => {
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
  }, 16);

  public onLayerVisibleChane = () => {
    this.setSelectValue(this.getLayerVisible());
  };

  public getIsMultiple(): boolean {
    return true;
  }

  public getDefault(
    option?: Partial<ILayerControlOption>,
  ): ILayerControlOption {
    return {
      ...super.getDefault(option),
      title: '图层控制',
      btnIcon: createL7Icon('l7-icon-tuceng'),
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

  public getLayerOptions(): OptionItem[] {
    return this.layers.map((layer: ILayer) => {
      return {
        text: layer.name,
        value: layer.name,
      };
    });
  }

  public onAdd(): HTMLElement {
    if (!this.controlOption.options?.length) {
      this.controlOption.options = this.getLayerOptions();
    }
    if (!this.controlOption.defaultValue) {
      this.controlOption.defaultValue = this.selectValue = this.getLayerVisible();
    }
    this.on('selectChange', this.onSelectChange);
    this.layers.forEach((layer) => {
      layer.on('show', this.onLayerVisibleChane);
      layer.on('hide', this.onLayerVisibleChane);
    });
    return super.onAdd();
  }

  public onRemove() {
    this.off('selectChange', this.onSelectChange);
    this.layers.forEach((layer) => {
      layer.off('show', this.onLayerVisibleChane);
      layer.off('hide', this.onLayerVisibleChane);
    });
  }
}
