import { IMapService } from '@l7/core';
import { bindAll, DOM, lnglatDistance } from '@l7/utils';
import Control, {
  IControlOption,
  PositionName,
  PositionType,
} from './BaseControl';
export interface ILayerControlOption extends IControlOption {
  collapsed: boolean;
  autoZIndex: boolean;
  hideSingleBase: boolean;
  sortLayers: boolean;
}
export default class Layers extends Control {
  private layerControlInputs: any[];
  private layers: any[];
  private lastZIndex: number;
  private handlingClick: boolean;

  constructor(cfg: Partial<ILayerControlOption>) {
    super(cfg);
    this.layerControlInputs = [];
    this.layers = [];
    this.lastZIndex = 0;
    this.handlingClick = false;
    // const baseLayers = this.get('baseLayers');
    // const overlays = this.get('overlayers');
    // for (const i in baseLayers) {
    //   this._addLayer(baseLayers[i], i);
    // }

    // for (const i in overlays) {
    //   this._addLayer(overlays[i], i, true);
    // }
    // bindAll([ '_checkDisabledLayers', '_onLayerChange', 'collapse', 'extend', 'expand', '_onInputClick' ], this);
  }

  public getDefault() {
    return {
      collapsed: true,
      position: PositionType.TOPRIGHT,
      autoZIndex: true,
      hideSingleBase: false,
      sortLayers: false,
    };
  }
}
