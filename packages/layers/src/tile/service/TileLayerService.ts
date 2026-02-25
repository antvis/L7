import type { ILayer, ILayerService, ILngLat, IRendererService, ITile } from '@antv/l7-core';
import type { SourceTile } from '@antv/l7-utils';

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

  /**
   * 使用 Map 存储瓦片实例，查找复杂度从 O(n) 降为 O(1)
   */
  private layerTilesMap: Map<string, ITile> = new Map();

  /**
   * 待销毁瓦片队列，用于分帧销毁
   */
  private pendingDestroyQueue: ITile[] = [];
  private maxDestroyPerFrame: number = 3;

  /**
   * 渲染图层缓存
   */
  private renderLayersCache: ILayer[] | null = null;
  private renderCacheDirty: boolean = true;

  constructor({ rendererService, layerService, parent }: ITileLayerServiceOptions) {
    this.rendererService = rendererService;
    this.layerService = layerService;
    this.parent = parent;
  }
  get tiles(): ITile[] {
    return Array.from(this.layerTilesMap.values());
  }

  /**
   * 获取待销毁瓦片数量
   */
  get pendingDestroyCount(): number {
    return this.pendingDestroyQueue.length;
  }

  public hasTile(tileKey: string): boolean {
    return this.layerTilesMap.has(tileKey);
  }

  public addTile(tile: ITile) {
    this.layerTilesMap.set(tile.key, tile);
    this.markRenderCacheDirty();
  }

  public getTile(tileKey: string): ITile | undefined {
    return this.layerTilesMap.get(tileKey);
  }

  public getVisibleTileBylngLat(lngLat: ILngLat): ITile | undefined {
    // 加载完成 & 可见 & 鼠标选中
    for (const tile of this.layerTilesMap.values()) {
      if (tile.isLoaded && tile.visible && tile.lnglatInBounds(lngLat)) {
        return tile;
      }
    }
    return undefined;
  }

  public removeTile(tileKey: string) {
    const tile = this.layerTilesMap.get(tileKey);
    if (tile) {
      this.layerTilesMap.delete(tileKey);
      // 放入待销毁队列，分帧销毁
      this.pendingDestroyQueue.push(tile);
      this.markRenderCacheDirty();
    }
  }

  /**
   * 分帧销毁待销毁队列中的瓦片
   */
  public processPendingDestroys(): void {
    const count = Math.min(this.pendingDestroyQueue.length, this.maxDestroyPerFrame);
    for (let i = 0; i < count; i++) {
      const tile = this.pendingDestroyQueue.shift();
      if (tile) {
        tile.destroy();
      }
    }
  }

  /**
   * 标记渲染缓存为脏
   */
  public markRenderCacheDirty(): void {
    this.renderCacheDirty = true;
  }
  public updateTileVisible(sourceTile: SourceTile) {
    const tile = this.getTile(sourceTile.key);
    if (sourceTile.isVisible) {
      // 不可见 => 可见 兄弟节点加载完成
      if (sourceTile.parent) {
        const flag = this.isChildrenLoaded(sourceTile.parent);
        tile?.updateVisible(flag);
      } else {
        tile?.updateVisible(true);
      }
    } else {
      // 可见 => 不可见 兄弟节点加载完成
      if (sourceTile.parent) {
        const flag = this.isChildrenLoaded(sourceTile.parent);
        tile?.updateVisible(!flag);
      } else {
        tile?.updateVisible(false);
      }
    }
    this.markRenderCacheDirty();
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
    return childrenTile.every((tile: SourceTile) => {
      const tileLayer = this.getTile(tile?.key);
      if (!tileLayer) {
        return true;
      }
      return tileLayer?.isLoaded === true;
    });
  }
  public async render() {
    // 每帧处理部分待销毁瓦片
    this.processPendingDestroys();

    const layers = this.getRenderLayers();
    const renders = layers.map(async (layer) => {
      await this.layerService.renderTileLayer(layer);
    });
    await Promise.all(renders);
  }

  public getRenderLayers() {
    // 使用缓存避免每帧重建
    if (!this.renderCacheDirty && this.renderLayersCache) {
      return this.renderLayersCache;
    }

    const layers: ILayer[] = [];
    this.layerTilesMap.forEach((tile) => {
      if (tile.visible && tile.isLoaded) {
        layers.push(...tile.getLayers());
      }
    });

    this.renderLayersCache = layers;
    this.renderCacheDirty = false;
    return layers;
  }

  public getLayers() {
    const layers: ILayer[] = [];
    this.layerTilesMap.forEach((tile) => {
      if (tile.isLoaded) {
        layers.push(...tile.getLayers());
      }
    });
    return layers;
  }

  public getTiles() {
    return Array.from(this.layerTilesMap.values());
  }

  public destroy() {
    // 先处理待销毁队列中的残留瓦片
    while (this.pendingDestroyQueue.length > 0) {
      const tile = this.pendingDestroyQueue.shift();
      tile?.destroy();
    }
    // 销毁所有已加载的瓦片
    this.layerTilesMap.forEach((t) => t.destroy());
    this.layerTilesMap.clear();
    // 清理缓存
    this.renderLayersCache = null;
    this.tileResource.clear();
  }
}
