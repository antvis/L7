import { ILayerService } from '@antv/l7-core';
import { TileLayerService } from './TileLayerService';
import { IInteractionTarget } from '@antv/l7-core';
import Tile from '../tileFactory/Tile';
export interface ITilePickServiceOptions {
  layerService: ILayerService;
  tileLayerService: TileLayerService;
}

const SELECT = 'select';
const ACTIVE = 'active';
export class TilePickService {
  private layerService: ILayerService;
  private tileLayerService: TileLayerService;
  private tilePickID = new Map();
  constructor({ layerService, tileLayerService }: ITilePickServiceOptions) {
    this.layerService = layerService;
    this.tileLayerService = tileLayerService;
  }
  pickRender(target: IInteractionTarget) {
    // 一个 TileLayer 有多个 Tile，但是会同时触发事件的只有一个 Tile
    const tile = this.tileLayerService.getVisibleTileBylngLat(target.lngLat);
    if (tile) {
      // TODO 多图层拾取
      const pickLayer = tile.getLayers()[0];
      pickLayer.layerPickService.pickRender(target)
    }
  }
  selectFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.clor2PickId(r, g, b);
    console.log(id)
    this.tilePickID.set(SELECT, id);
    this.updateHighLight(r, g, b, SELECT);
  }

  highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.clor2PickId(r, g, b);
    this.tilePickID.set(ACTIVE, id);
    this.updateHighLight(r, g, b, ACTIVE);
  }

  updateHighLight(r: number, g: number, b: number, type: string){
    this.tileLayerService.tiles.map((tile: Tile) => {
      const layers = tile.getLayers();
      console.log(layers)
      layers.forEach((layer) => {
        switch(type) {
          case SELECT:
            layer.hooks.beforeSelect.call([r, g, b]);
            break;
          case ACTIVE:
            layer.hooks.beforeHighlight.call([r, g, b]);
            break;
        }
      });
    });
  }

  setPickState() {
    const selectColor = this.tilePickID.get(SELECT)
    const activeColor = this.tilePickID.get(ACTIVE)
    if(selectColor) {
      const [r, g, b] = this.pickId2Color(selectColor);
      this.updateHighLight(r, g, b, SELECT);
      return;
    }
    if(activeColor) {
      const [r, g, b] = this.pickId2Color(activeColor);
      this.updateHighLight(r, g, b, ACTIVE);
      return;
    }
  }

  private clor2PickId (r: number, g: number, b: number){
    return r + '-' + g + '-' + b;
  }

  private pickId2Color(str: string){
    return str.split('-').map(n => +n)
  }

  /** 从瓦片中根据数据 */
  getFeatureById() {

  }
}
