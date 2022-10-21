import {
  ILayer,
  IMapService,
  ILayerService,
  IRendererService,
  TYPES,
  ISource,
  IPickingService,
  IInteractionTarget
} from '@antv/l7-core';
import { SourceTile, TilesetManager } from '@antv/l7-utils';
import { TileLayerService } from '../service/TileLayerService';
import { TilePickService } from '../service/TilePickService';
import { debounce } from 'lodash';
import { getTileFactory } from '../tileFactory'

export default class BaseTileLayer {
  private parent: ILayer;
  public tileLayerService: TileLayerService;
  protected mapService: IMapService;
  protected layerService: ILayerService;
  protected rendererService: IRendererService;
  protected pickingService:IPickingService;
  protected tilePickService: TilePickService;
  public tilesetManager: TilesetManager; // 瓦片数据管理器
  public initedTileset: boolean = false; // 瓦片是否加载成功

  protected lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  constructor(parent: ILayer) {
    this.parent = parent;
    const container = this.parent.getContainer();
    this.rendererService = container.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = container.get<ILayerService>(TYPES.ILayerService);
    this.mapService = container.get<IMapService>(TYPES.IMapService);
    this.pickingService = container.get<IPickingService>(
        TYPES.IPickingService,
      );

      // 初始化瓦片管理服务
      this.tileLayerService = new TileLayerService({
        rendererService: this.rendererService,
        layerService:this.layerService,
        parent
      })
      // 初始化拾取服务
      this.tilePickService = new TilePickService({
        tileLayerService:  this.tileLayerService,
        layerService:this.layerService,
      })

      // 重置
      this.parent.setLayerPickService(this.tilePickService);

      this.initTileSetManager();
  
  }

  protected initTileSetManager() {
    const source: ISource = this.parent.getSource();
    this.tilesetManager = source.tileset as TilesetManager;

    if (!this.initedTileset) {
      this.bindTilesetEvent();
      this.initedTileset = true;
    }

    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);
  }
  protected mapchange() {
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

    this.tilesetManager?.throttleUpdate(zoom, latLonBounds);
  }
  protected getCurrentView() {
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

  private bindTilesetEvent() {
    // 瓦片数据加载成功
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.tilesetManager.on('tile-loaded', (tile: SourceTile) => {
      // 将事件抛出，图层上可以监听使用
    });

    // 瓦片数据从缓存删除或被执行重新加载
    this.tilesetManager.on('tile-unload', (tile: SourceTile) => {
      // 将事件抛出，图层上可以监听使用
      this.tileUnLoad(tile);
    });

    // 瓦片数据加载失败
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.tilesetManager.on('tile-error', (error, tile: SourceTile) => {
      // 将事件抛出，图层上可以监听使用
      this.tileError(error);
    });

    // 瓦片显隐状态更新
    this.tilesetManager.on('tile-update', () => {
      this.tileUpdate();
    });

    // 地图视野发生改变
    this.mapService.on('zoomend', () => this.mapchange());
    this.mapService.on('moveend', () => this.viewchange());
  }
 
  public render() {
    this.tileLayerService.render();
  }

  //  防抖操作
  viewchange = debounce(this.mapchange, 24);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public tileLoaded(tile: SourceTile) {
    //
  }

  public tileError(error: Error) {
    console.warn('error:', error);
  }

  public destroy() {
    this.tilesetManager?.destroy();
    this.tileLayerService.destroy();
  }

  public tileUnLoad(tile: SourceTile) {
    this.tileLayerService.removeTile(tile.key);
  }

  public async tileUpdate() {
    if (!this.tilesetManager) {
      return;
    }
    console.log(this.tilesetManager.tiles)
    await Promise.all(this.tilesetManager.tiles
      .filter((tile: SourceTile) => tile.isLoaded) // 过滤未加载完成的
      .filter((tile: SourceTile) => tile.isVisibleChange) // 过滤未发生变化的
      .filter((tile: SourceTile) => this.isTileReady(tile)) // 过滤未发生变化的
      .map(async (tile: SourceTile) => {
        if (!this.tileLayerService.hasTile(tile.key)) {
          const tileInstance = getTileFactory(this.parent);
          const tileLayer = new tileInstance(tile, this.parent);
          await tileLayer.initTileLayer();
          if(tileLayer.getLayers().length!==0) {
            this.tileLayerService.addTile(tileLayer);
            this.layerService.reRender()
          }
          this.tileLayerService.addTile(tileLayer);
          this.layerService.reRender()
        } else {

          this.tileLayerService.updateTileVisible(tile);
          this.layerService.reRender()
        }
      }));
 
    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }

  public isTileReady(tile: SourceTile) {
    
    // if (tile.data?.layers && this.sourceLayer) {
    //   // vector
    //   const vectorTileLayer = tile.data.layers[this.sourceLayer];
    //   const features = vectorTileLayer?.features;
    //   if (!(Array.isArray(features) && features.length > 0)) {
    //     return false;
    //   }
    // }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setPickState(layers: ILayer[]) {}

  public pickRender(target: IInteractionTarget) {
    this.tilePickService.pickRender(target);
  }
  public selectFeature(pickedColors: Uint8Array | undefined) {
    this.tilePickService.selectFeature(pickedColors)
  }

  public highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    this.tilePickService.highlightPickedFeature(pickedColors)
  }


}
