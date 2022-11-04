import { ILayerService, ITile, ITilePickService, IInteractionTarget } from '@antv/l7-core';
import { decodePickingColor, encodePickingColor } from '@antv/l7-utils';
import { TileLayerService } from './TileLayerService';
import { TileSourceService } from './TileSourceService';
export interface ITilePickServiceOptions {
  layerService: ILayerService;
  tileLayerService: TileLayerService;
}

const SELECT = 'select';
const ACTIVE = 'active';
export class TilePickService implements ITilePickService{
  private layerService: ILayerService;
  private tileLayerService: TileLayerService;
  private tileSourceService: TileSourceService;
  private tilePickID = new Map();
  constructor({ layerService, tileLayerService }: ITilePickServiceOptions) {
    this.layerService = layerService;
    this.tileLayerService = tileLayerService;
    this.tileSourceService = new TileSourceService();
  }
  pickRender(target: IInteractionTarget) {
    // 一个 TileLayer 有多个 Tile，但是会同时触发事件的只有一个 Tile
    const tile = this.tileLayerService.getVisibleTileBylngLat(target.lngLat);
    if (tile) {
      // TODO 多图层拾取
      const pickLayer = tile.getMainLayer();
      pickLayer?.layerPickService.pickRender(target)
      
    }
  }
  selectFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.color2PickId(r, g, b);
    this.tilePickID.set(SELECT, id);
    this.updateHighLight(r, g, b, SELECT);
  }

  highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.color2PickId(r, g, b);
    this.tilePickID.set(ACTIVE, id);
    this.updateHighLight(r, g, b, ACTIVE);
  }

  updateHighLight(r: number, g: number, b: number, type: string){
    this.tileLayerService.tiles.map((tile: ITile) => {
      const layer = tile.getMainLayer();
        switch(type) {
          case SELECT:
            layer?.hooks.beforeSelect.call([r, g, b]);
            break;
          case ACTIVE:
            layer?.hooks.beforeHighlight.call([r, g, b]);
            break;
        }
      
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

  private color2PickId (r: number, g: number, b: number){
    return decodePickingColor(new Uint8Array([r,g,b]))
  }

  private pickId2Color(str: number){
    return encodePickingColor(str )
  }

  /** 从瓦片中根据数据 */
  getFeatureById(pickedFeatureIdx: number) {
    // 提取当前可见瓦片
    const tiles = this.tileLayerService.getTiles().filter(tile => tile.visible);
    // 提取当前可见瓦片中匹配 ID 的 feature 列表
    const features: any[] = [];
    tiles.map(tile => {
      features.push(...tile.getFeatureById(pickedFeatureIdx));
    })

    if (features.length <= 0) {
      return null;
    }
    // 将 feature 列表合并后返回
    // 统一返回成 polygon 的格式 点、线、面可以通用

    // const data = this.tileSourceService.getCombineFeature(features);

    return []
  }
}
