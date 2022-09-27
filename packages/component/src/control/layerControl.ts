import { ILayer } from '@antv/l7-core';
import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ISelectControlOption,
  ControlOptionItem,
} from './baseControl/selectControl';

export interface ILayerControlOption extends ISelectControlOption {
  layers: ILayer[];
}

export { LayerControl };

export default class LayerControl extends SelectControl<ILayerControlOption> {
  protected get layers() {
    return this.controlOption.layers || this.layerService.getLayers() || [];
  }

  public getDefault(
    option?: Partial<ILayerControlOption>,
  ): ILayerControlOption {
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

  public setOptions(option: Partial<ILayerControlOption>) {
    const isLayerChange = this.checkUpdateOption(option, ['layers']);
    if (isLayerChange) {
      this.unbindLayerVisibleCallback();
    }
    super.setOptions(option);
    if (isLayerChange) {
      this.bindLayerVisibleCallback();
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
    this.bindLayerVisibleCallback();
    return super.onAdd();
  }

  public bindLayerVisibleCallback = () => {
    this.layers.forEach((layer) => {
      layer.on('show', this.onLayerVisibleChane);
      layer.on('hide', this.onLayerVisibleChane);
    });
  };

  public unbindLayerVisibleCallback = () => {
    this.layers.forEach((layer) => {
      layer.off('show', this.onLayerVisibleChane);
      layer.off('hide', this.onLayerVisibleChane);
    });
  };

  public onRemove() {
    this.off('selectChange', this.onSelectChange);
    this.layerService.off('layerChange', this.onLayerChange);
    this.unbindLayerVisibleCallback();
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
