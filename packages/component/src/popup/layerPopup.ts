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
  config: LayerItemConfig[];
  trigger: 'hover' | 'click';
}

export default class LayerPopup extends Popup<ILayerPopupOption> {
  // public addTo(scene: Container) {
  //   const result = super.addTo(scene);
  //   return result;
  // }
}
