import { ILayer, IPopupOption } from '@antv/l7-core';
// import { Container } from 'inversify';
import Popup from './popup';

export type ILayerField = {
  field: string;
  fieldFormat?: (field: string) => string;
  valueFormat?: (value: any) => string;
};

export type LayerItemConfig = {
  layer: ILayer;
  fields: ILayerField[];
};

export interface ILayerPopupOption extends IPopupOption {
  config: Array<ILayer | LayerItemConfig>;
  trigger: 'hover' | 'click';
}

export default class LayerPopup extends Popup<ILayerPopupOption> {
  // public addTo(scene: Container) {
  //   const result = super.addTo(scene);
  //   return result;
  // }

  protected bindLayerEvent() {
    const { config } = this.popupOption;
    config.map(this.getLayer).map((layer) => {
      layer.on('mousemove', this.onLayerMouseMove);
      layer.on('mouseout', this.onLayerMouseOut);
      layer.on('click', this.onLayerClick);
    });
  }

  protected unbindLayerEvent() {
    const { config } = this.popupOption;
    config.map(this.getLayer).map((layer) => {
      layer.off('mousemove', this.onLayerMouseMove);
      layer.off('mouseout', this.onLayerMouseOut);
      layer.off('click', this.onLayerClick);
    });
  }

  protected onLayerMouseMove = (e: any) => {};

  protected onLayerMouseOut = (e: any) => {};

  protected onLayerClick = (e: any) => {};

  protected getLayer(config: ILayer | LayerItemConfig): ILayer {
    // @ts-ignore
    return config.layer || config;
  }
}
