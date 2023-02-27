import {
  ILayer,
  ILayerService,
  ILngLat,
  IRendererService,
  ITile,
} from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import 'reflect-metadata';

interface ITileLayerServiceOptions {
  rendererService: IRendererService;
  layerService: ILayerService;
  parent: ILayer;
}
export class TileLayerService {
  /**
   * tileResource 用于存储瓦片的全局资源
   */
  public tileResource = new Map();
  private rendererService: IRendererService;
  private layerService: ILayerService;
  private parent: ILayer;

  private layerTiles: ITile[] = [];
  constructor({
    rendererService,
    layerService,
    parent,
  }: ITileLayerServiceOptions) {
    this.rendererService = rendererService;
    this.layerService = layerService;
    this.parent = parent;
  }
  get tiles(): ITile[] {
    return this.layerTiles;
  }

  public hasTile(tileKey: string): boolean {
    return this.layerTiles.some((tile) => tile.key === tileKey);
  }

  public addTile(tile: ITile) {
    this.layerTiles.push(tile);
  }

  public getTile(tileKey: string): ITile | undefined {
    return this.layerTiles.find((tile) => tile.key === tileKey);
  }

  public getVisibleTileBylngLat(lngLat: ILngLat): ITile | undefined {
    // 加载完成 & 可见 & 鼠标选中
    return this.layerTiles.find(
      (tile) => tile.isLoaded && tile.visible && tile.lnglatInBounds(lngLat),
    );
  }

  public removeTile(tileKey: string) {
    const index = this.layerTiles.findIndex((t) => t.key === tileKey);
    const tile = this.layerTiles.splice(index, 1);
    if (tile[0]) {
      tile[0].destroy();
    }
  }
  public updateTileVisible(sourceTile: SourceTile) {
    const tile = this.getTile(sourceTile.key);
    // if(sourceTile.isVisible) {
    //   // 不可见 => 可见 兄弟节点加载完成
    //   if(sourceTile.parent) {
    //     const flag = this.isChildrenLoaded(sourceTile.parent)
    //     tile?.updateVisible(flag);
    //   } else {
    //     tile?.updateVisible(true);
    //   }

    // } else {
    //    // 可见 => 不可见 兄弟节点加载完成
    //    if(sourceTile.parent) {
    //     const flag = this.isChildrenLoaded(sourceTile.parent)
    //     tile?.updateVisible(!flag);
    //   } else {
    //     tile?.updateVisible(false);
    //   }
    // }

    tile?.updateVisible(sourceTile.isVisible);
  }
  public isParentLoaded(sourceTile: SourceTile): boolean {
    const parentTile = sourceTile.parent;
    if (!parentTile) {
      return true;
    }
    const tile = this.getTile(parentTile?.key);
    if (tile?.isLoaded) {
      // 递归父级
      return true;
    }

    return false;
  }

  public isChildrenLoaded(sourceTile: SourceTile): boolean {
    const childrenTile = sourceTile?.children;
    if (childrenTile.length === 0) {
      return true;
    }
    return childrenTile.some((tile: SourceTile) => {
      const tileLayer = this.getTile(tile?.key);
      return tileLayer?.isLoaded === false;
    });
  }
  public async render() {
    const layers = this.getRenderLayers();
    const renders = layers.map(async (layer) => {
      await this.layerService.renderTileLayer(layer);
    });
    Promise.all(renders);
  }

  public getRenderLayers() {
    const tileList = this.layerTiles.filter(
      (t: ITile) => t.visible && t.isLoaded,
    );
    const layers: ILayer[] = [];
    tileList.map((tile: ITile) => layers.push(...tile.getLayers()));
    return layers;
  }

  public getLayers() {
    const tileList = this.layerTiles.filter((t: ITile) => t.isLoaded);
    const layers: ILayer[] = [];
    tileList.map((tile) => layers.push(...tile.getLayers()));
    return layers;
  }

  public getTiles() {
    return this.layerTiles;
  }

  public destroy() {
    this.layerTiles.forEach((t: ITile) => t.destroy());
    this.tileResource.clear();
  }
}
