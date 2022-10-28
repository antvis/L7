import { ILayerService, ITile, ITilePickService, ILngLat, IInteractionTarget } from '@antv/l7-core';
import { TileLayerService } from './TileLayerService';
export interface ITilePickServiceOptions {
  layerService: ILayerService;
  tileLayerService: TileLayerService;
}

const SELECT = 'select';
const ACTIVE = 'active';
export class TilePickService implements ITilePickService{
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
    this.tileLayerService.tiles.map((tile: ITile) => {
      const layers = tile.getLayers();
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
  getFeatureById(pickedFeatureIdx: number, lngLat: ILngLat) {
    const tile = this.tileLayerService.getVisibleTileBylngLat(lngLat)
    if (!tile) {
      return null;
    }

    const layers = tile.getLayers();
    let features = null;
    // 瓦片数据各自独立分布，没有完整的集合
    // TODO: 合并瓦片矢量数据，返回完整的的数据集
    layers.some(layer => {
      // 图层的 originData 可能并没有 id，因此我们使用编码后的 dataArray
      const data = layer.getSource().data.dataArray;

      // _id 编码值可能根据字段进行编码，因此可能命中多个 feature
      const pickedFeature = data.filter(d => d._id === pickedFeatureIdx)
      
      if(pickedFeature.length > 0) {
        features = pickedFeature;
        return true;
      } else {
        return false;
      }
    })
    return features;
  }
}
