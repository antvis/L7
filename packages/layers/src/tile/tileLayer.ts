import {
  ILayer,
  ILayerService,
  IMapService,
  ISource,
  ISubLayerInitOptions,
  ITileLayer,
  ITileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { TileLayerManager } from './manager/tileLayerManager';
import { getTileFactory, ITileFactory, TileType } from './tileFactory';

const DefaultSunLayerInitOptions: ISubLayerInitOptions = {
  zIndex: 0,
  opacity: 1,
};

export default class TileLayer implements ITileLayer {
  public parent: ILayer;
  // 瓦片是否加载成功
  public initedTileset: boolean = false;
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;
  public tileLayerManager: ITileLayerManager;

  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  private timer: any;
  private mapService: IMapService;
  private layerService: ILayerService;

  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
  }: ITileLayerOPtions) {
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;

    this.tileLayerManager = new TileLayerManager(parent, rendererService);

    this.initTileSetManager();
  }

  private initTileSetManager() {
    const source: ISource = this.parent.getSource();
    this.tilesetManager = source.tileset as TilesetManager;

    if (!this.initedTileset) {
      this.bindTilesetEvent();
      this.initedTileset = true;
    }

    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);
  }

  private bindTilesetEvent() {
    if (!this.tilesetManager) {
      return;
    }
    // 瓦片数据加载成功
    this.tilesetManager.on('tile-loaded', (tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
    });

    // 瓦片数据从缓存删除或被执行重新加载
    this.tilesetManager.on('tile-unload', (tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
      this.tileLayerManager.removeChilds(tile.layerIDList);
    });

    // 瓦片数据加载失败
    this.tilesetManager.on('tile-error', (error, tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
    });

    // 瓦片显隐状态更新
    this.tilesetManager.on('tile-update', this.renderSubLayers);

    // 地图视野发生改变
    this.mapService.on('mapchange', (e) => {
      const { latLonBounds, zoom } = this.getCurrentView();

      if (this.mapService.version === 'GAODE1.x') {
        const { visible } = this.parent.getLayerConfig();
        if (zoom < 3 && visible) {
          this.parent.updateLayerConfig({ visible: false });
          this.layerService.updateLayerRenderList();
        } else if (zoom >= 3 && !visible) {
          this.parent.updateLayerConfig({ visible: true });
          this.layerService.updateLayerRenderList();
        }
      }

      if (
        this.lastViewStates &&
        this.lastViewStates.zoom === zoom &&
        this.lastViewStates.latLonBounds.toString() === latLonBounds.toString()
      ) {
        return;
      }
      this.lastViewStates = { zoom, latLonBounds };

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.tilesetManager?.update(zoom, latLonBounds);
      }, 250);
    });
  }

  private renderSubLayers = () => {
    if (!this.tilesetManager) {
      return;
    }

    this.tilesetManager.tiles
      .filter((tile) => tile.isLoaded)
      .map((tile) => {
        if (tile.layerIDList.length === 0) {
          const { layers, layerIDList } = this.tileLayerManager.createTile(
            tile,
          );
          tile.layerIDList = layerIDList;
          this.tileLayerManager.addChilds(layers);
        } else {
          const layers = this.tileLayerManager.getChilds(tile.layerIDList);
          this.tileLayerManager.updateLayerConfig(layers, tile.isVisible);
        }
      });

    this.layerService.renderLayers();

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  };

  private getCurrentView() {
    const bounds = this.mapService.getBounds();
    const latLonBounds: [number, number, number, number] = [
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1],
    ];
    const zoom = this.mapService.getZoom();

    return { latLonBounds, zoom };
  }
}
