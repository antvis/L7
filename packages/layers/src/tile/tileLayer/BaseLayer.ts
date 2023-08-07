import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IMapService,
  IPickingService,
  IRendererService,
  ISource,
  TYPES,
} from '@antv/l7-core';
import { SourceTile, TilesetManager } from '@antv/l7-utils';
import { debounce } from 'lodash';
import { TileLayerService } from '../service/TileLayerService';
import { TilePickService } from '../service/TilePickService';
import { ProxyFuncs } from '../style/constants';
import { getTileFactory } from '../tileFactory';

export default class BaseTileLayer {
  private parent: ILayer;

  public tileLayerService: TileLayerService;
  protected mapService: IMapService;
  protected layerService: ILayerService;
  protected rendererService: IRendererService;
  protected pickingService: IPickingService;
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
    this.pickingService = container.get<IPickingService>(TYPES.IPickingService);

    // 初始化瓦片管理服务
    this.tileLayerService = new TileLayerService({
      rendererService: this.rendererService,
      layerService: this.layerService,
      parent,
    });
    // 初始化拾取服务
    this.tilePickService = new TilePickService({
      tileLayerService: this.tileLayerService,
      layerService: this.layerService,
      parent,
    });

    // 重置
    this.parent.setLayerPickService(this.tilePickService);
    this.proxy(parent);

    this.initTileSetManager();
  }

  protected initTileSetManager() {
    const source: ISource = this.parent.getSource();
    this.tilesetManager = source.tileset as TilesetManager;

    if (!this.initedTileset) {
      this.bindTilesetEvent();
      this.initedTileset = true;
    }

    // 图层不可见时，不触发加载瓦片
    if (this.parent.isVisible() === false) {
      return;
    }

    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);
  }

  protected mapchange = () => {
    // 图层不可见时，不触发加载瓦片
    if (this.parent.isVisible() === false) {
      return;
    }

    const { latLonBounds, zoom } = this.getCurrentView();

    if (this.mapService.version === 'GAODE1.x') {
      const { visible } = this.parent.getLayerConfig();
      if (zoom < 2 && visible) {
        this.parent.updateLayerConfig({ visible: false });
        this.layerService.reRender();
      } else if (zoom >= 2 && !visible) {
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
  };

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
    this.mapService.on('zoomend', this.mapchange);
    this.mapService.on('moveend', this.viewchange);
  }

  public render() {
    this.tileLayerService.render();
  }

  public getLayers() {
    return this.tileLayerService.getLayers();
  }

  public getTiles() {
    return this.tileLayerService.getTiles();
  }

  public getTile(key: string) {
    return this.tileLayerService.getTile(key);
  }

  //  防抖操作
  public viewchange = debounce(this.mapchange, 24);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public tileLoaded(tile: SourceTile) {
    //
  }

  public tileError(error: Error) {
    console.warn('error:', error);
  }

  public destroy() {
    this.mapService.off('zoomend', this.mapchange);
    this.mapService.off('moveend', this.viewchange);
    this.tilesetManager?.destroy();
    this.tileLayerService.destroy();
  }
  // 重新加载
  public reload() {
    // 瓦片重新加载
    this.tilesetManager.clear();
    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);
  }

  public tileUnLoad(tile: SourceTile) {
    this.tileLayerService.removeTile(tile.key);
  }

  public async tileUpdate() {
    if (!this.tilesetManager) {
      return;
    }
    const minZoom = this.parent.getMinZoom();
    const maxZoom = this.parent.getMaxZoom();
    await Promise.all(
      this.tilesetManager.tiles
        .filter((tile: SourceTile) => tile.isLoaded) // 过滤未加载完成的
        .filter((tile: SourceTile) => tile.isVisibleChange) // 过滤未发生变化的
        .filter((tile: SourceTile) => tile.data)
        .filter((tile: SourceTile) => tile.z >= minZoom && tile.z < maxZoom)
        .map(async (tile: SourceTile) => {
          // 未加载瓦片
          if (!this.tileLayerService.hasTile(tile.key)) {
            const tileInstance = getTileFactory(this.parent);
            const tileLayer = new tileInstance(tile, this.parent);
            await tileLayer.initTileLayer();
            this.tilePickService.setPickState();
            if (tileLayer.getLayers().length !== 0) {
              this.tileLayerService.addTile(tileLayer);
              this.tileLayerService.updateTileVisible(tile);
              this.layerService.reRender();
            }
          } else {
            // 已加载瓦片

            this.tileLayerService.updateTileVisible(tile);
            this.tilePickService.setPickState();
            this.layerService.reRender();
          }
        }),
    );

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setPickState(layers: ILayer[]) {
    return;
  }

  public pickRender(target: IInteractionTarget) {
    this.tilePickService.pickRender(target);
  }
  public selectFeature(pickedColors: Uint8Array | undefined) {
    this.tilePickService.selectFeature(pickedColors);
  }

  public highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    this.tilePickService.highlightPickedFeature(pickedColors);
  }

  /**
   * 实现 TileLayer 对子图层方法的代理
   * @param parent
   */
  private proxy(parent: ILayer) {
    ProxyFuncs.forEach((func) => {
      // @ts-ignore
      const oldStyleFunc = parent[func].bind(parent);
      // @ts-ignore
      parent[func] = (...args: any) => {
        oldStyleFunc(...args);
        this.getLayers().map((child) => {
          // @ts-ignore
          child[func](...args);
        });
        // Tip: 目前在更新 RasterData 的 colorTexture 的时候需要额外优化
        if (func === 'style') {
          this.getTiles().forEach((tile: any) => tile.styleUpdate(...args));
        }

        return parent;
      };
    });
  }
}
