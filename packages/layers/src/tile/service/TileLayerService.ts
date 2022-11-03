import { ILayer, ILayerService, ILngLat, IRendererService, ITile } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import 'reflect-metadata';

interface TileLayerServiceOptions {
  rendererService: IRendererService;
  layerService: ILayerService
  parent:ILayer;
}
export class TileLayerService {
  /**
   * tileResource 用于存储瓦片的全局资源
   */
  public tileResource = new Map();
  private rendererService: IRendererService;
  private layerService: ILayerService;
  private parent: ILayer;


  private _tiles: ITile[] = [];
  constructor({ rendererService,layerService, parent }: TileLayerServiceOptions) {
    this.rendererService = rendererService;
    this.layerService =layerService;
    this.parent = parent;
  }
  get tiles(): ITile[] {
    return this._tiles;
  }

  hasTile(tileKey: string): boolean {
    return this._tiles.some((tile) => tile.key === tileKey);
  }

  addTile(tile: ITile) {
    this._tiles.push(tile);
  }

  getTile(tileKey: string): ITile | undefined {
    return this._tiles.find((tile) => tile.key === tileKey);
  }
  
  getVisibleTileBylngLat(lngLat: ILngLat): ITile | undefined {
    // 加载完成 & 可见 & 鼠标选中
    return this._tiles.find(
      (tile) => tile.isLoaded && tile.visible && tile.lnglatInBounds(lngLat),
    );
  }

  removeTile(tileKey: string) {
    const index = this._tiles.findIndex((tile) => tile.key === tileKey);
    const tile = this._tiles.splice(index, 1);
    tile[0] && tile[0].destroy();
  }
  updateTileVisible(sourceTile: SourceTile) {
    const tile = this.getTile(sourceTile.key);
    console.log()
    tile?.updateVisible(sourceTile.isVisible);

  }
  beforeRender() {
    // TODO 统一处理状态更新 attribute style
    
  }

  async render() {
    const layers = this.getRenderLayers();
    layers.map(async layer => {
      await this.layerService.renderLayer(layer);
    })    
  }

  getRenderLayers() {
    const tileList = this._tiles.filter((t)=>t.visible && t.isLoaded);
    const layers: ILayer[] = [];
    tileList.map(tile => layers.push(...tile.getLayers()))
    return layers;
  }

  getLayers(){
    const tileList = this._tiles.filter((t)=>t.isLoaded);
    const layers: ILayer[] = [];
    tileList.map(tile => layers.push(...tile.getLayers()))
    return layers;
  }

  getTiles() {
    return this._tiles;
  }


  destroy() {
    this._tiles.forEach((t) => t.destroy());
    this.tileResource.clear();
  }
}
