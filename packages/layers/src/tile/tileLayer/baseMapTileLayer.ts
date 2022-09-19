import {
  ILayer,
  ILayerService,
  IMapService,
  ISource,
  IBaseTileLayer,
  IBaseTileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { BaseMapTileLayerManager } from '../manager/baseMapTileLayerManager';
import { debounce } from 'lodash';

export default class BaseTileLayer implements IBaseTileLayer {
  public get children() {
    return this.tileLayerManager.children;
  }
  public type: string = 'baseTile';
  public sourceLayer: string;
  public parent: ILayer;
  // 瓦片是否加载成功
  public initedTileset: boolean = false;
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;
  public tileLayerManager: IBaseTileLayerManager;
  public scaleField: any;

  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  protected mapService: IMapService;
  protected layerService: ILayerService;

  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
  }: ITileLayerOPtions) {
    const parentSource = parent.getSource();
    const { sourceLayer } =
      parentSource?.data?.tilesetOptions || {};
    this.sourceLayer = sourceLayer;
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;

    this.tileLayerManager = new BaseMapTileLayerManager(
      parent,
      mapService,
      rendererService,
    );

    this.initTileSetManager();
  }

  /**
   * 渲染瓦片的图层
   */
  public render() {
    if (this.tileLayerManager) {
      this.tileLayerManager.render();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public tileLoaded(tile: Tile) {
    //
  }

  public tileError(error: Error) {
    console.warn('error:', error);
  }

  public tileUnLoad(tile: Tile) {
    this.tileLayerManager.removeChilds(tile.layerIDList, false);
  }

  public tileUpdate() {
    // Base Function
    if (!this.tilesetManager) {
      return;
    }

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
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

  private mapchange() {
    const { latLonBounds, zoom } = this.getCurrentView();

    if (this.mapService.version === 'GAODE1.x') {
      const { visible } = this.parent.getLayerConfig();
      if (zoom < 3 && visible) {
        this.parent.updateLayerConfig({ visible: false });
        this.layerService.reRender();
      } else if (zoom >= 3 && !visible) {
        this.parent.updateLayerConfig({ visible: true });
        this.layerService.reRender();
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

    this.tilesetManager?.update(zoom, latLonBounds);
  }

  private bindTilesetEvent() {
    if (!this.tilesetManager) {
      return;
    }
    // 瓦片数据加载成功
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.tilesetManager.on('tile-loaded', (tile: Tile) => {
      // 将事件抛出，图层上可以监听使用
    });

    // 瓦片数据从缓存删除或被执行重新加载
    this.tilesetManager.on('tile-unload', (tile: Tile) => {
      // 将事件抛出，图层上可以监听使用
      this.tileUnLoad(tile);
    });

    // 瓦片数据加载失败
    this.tilesetManager.on('tile-error', (error, tile: Tile) => {
      // 将事件抛出，图层上可以监听使用
      this.tileError(error);
    });

    // 瓦片显隐状态更新
    this.tilesetManager.on('tile-update', () => {
      this.tileUpdate();
    });

    // 地图视野发生改变
    this.mapService.on('zoomend', () => this.viewchange());
    this.mapService.on('moveend', () => this.viewchange());
  }

  //  防抖操作
  viewchange = debounce(this.mapchange, 200)

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
