import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IMapService,
  ISource,
  ITileLayer,
  ITileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import { decodePickingColor, Tile, TilesetManager } from '@antv/l7-utils';
import { BaseMapTileLayerManager } from '../manager/baseMapTileLayerManager';
import { debounce } from 'lodash';

export default class BaseTileLayer implements ITileLayer {
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
  public tileLayerManager: ITileLayerManager;
  public scaleField: any;
  public tileUpdateType: string = 'move';

  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  private timer: any;
  protected mapService: IMapService;
  protected layerService: ILayerService;
  private pickColors: {
    select: any;
    active: any;
  } = {
    select: null,
    active: null,
  };

  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
    pickingService,
    transforms
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
      pickingService,
      layerService,
      transforms
    );

    this.initTileSetManager();

    this.scaleField = this.parent.getScaleOptions();
  }

  /**
   * 渲染瓦片的图层
   */
  public render() {
    if (this.tileLayerManager) {
      this.tileLayerManager.render();
    }
  }

  public clearPick(type: string) {
    if (type === 'mousemove') {
      this.tileLayerManager.tilePickManager.clearPick();
    }
  }

  /**
   * 清除 select 的选中状态
   */
  public clearPickState() {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .filter((child) => child.getCurrentSelectedId() !== null)
      .map((child) => {
        this.selectFeature(child, new Uint8Array([0, 0, 0, 0]));
        child.setCurrentSelectedId(null);
      });
  }

  /**
   * 瓦片图层独立的拾取逻辑
   * @param target
   * @returns
   */
  public pickLayers(target: IInteractionTarget) {
    return this.tileLayerManager.pickLayers(target);
  }

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

  protected setPickState(layers: ILayer[]) {
    if (this.pickColors.select) {
      const selectedId = decodePickingColor(this.pickColors.select);
      layers.map((layer) => {
        this.selectFeature(layer, this.pickColors.select);
        layer.setCurrentSelectedId(selectedId);
      });
    }

    if (this.pickColors.active) {
      const selectedId = decodePickingColor(this.pickColors.active);
      layers
        .filter((layer) => layer.inited && layer.isVisible())
        .map((layer) => {
          layer.hooks.beforeHighlight.call(this.pickColors.active);
          layer.setCurrentPickId(selectedId);
        });
    }
  }


  private selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
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

    this.tilesetManager?.update(zoom, latLonBounds);
  }

  private bindTilesetEvent() {
    if (!this.tilesetManager) {
      return;
    }
    // 瓦片数据加载成功
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
