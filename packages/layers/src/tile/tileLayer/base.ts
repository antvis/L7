import {
    ILayer,
    IMapService,
    ILayerService,
    ISource,
  } from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { debounce } from 'lodash';
import { updateTileVisible } from '../utils';

export class Base {
    public tileLayerManager: any;
    public get children() {
        return this.tileLayerManager.children;
    }
    public sourceLayer: string;
    public parent: ILayer;
    public initedTileset: boolean = false; // 瓦片是否加载成功
    
    public tilesetManager: TilesetManager | undefined; // 瓦片数据管理器
    public scaleField: any;

    protected mapService: IMapService;
    protected layerService: ILayerService;

    protected lastViewStates: {
        zoom: number;
        latLonBounds: [number, number, number, number];
      };
    
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    public render() {
        this.tileLayerManager.render();
    }

    //  防抖操作
    viewchange = debounce(this.mapchange, 200)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public tileLoaded(tile: Tile) {
    //
    }

    public tileError(error: Error) {
      console.warn('error:', error);
    }

    public destroy() {
      this.tilesetManager?.destroy();
      this.tileLayerManager.destroy();
    }

    public tileUnLoad(tile: Tile) {
      this.tileLayerManager.removeTile(tile);
    }
  
    public async tileUpdate() {
      if (!this.tilesetManager) {
        return;
      }
      this.tilesetManager.tiles
        .filter((tile: Tile) => tile.isLoaded)
        .map(async (tile: Tile) => {
          if(!this.isTileReady(tile)) return;

          if (!this.tileLayerManager.hasTile(tile)) {
            const { layers } = await this.tileLayerManager.addTile(tile);
            this.setPickState(layers)
          } else {
            if (!tile.isVisibleChange) {
              return;
            }
            const layers = this.tileLayerManager.getChildren(tile.layerIDList);
            updateTileVisible(tile, layers, this.layerService);
            this.setPickState(layers)
          }
        });
  
      if (this.tilesetManager.isLoaded) {
        // 将事件抛出，图层上可以使用瓦片
        this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
      }
    }

    public isTileReady(tile:Tile){
      if (tile.data?.layers && this.sourceLayer) {
        // vector
        const vectorTileLayer = tile.data.layers[this.sourceLayer];
        const features = vectorTileLayer?.features;
        if (!(Array.isArray(features) && features.length > 0)) {
          return false;
        }
      }
     
      return true;  
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setPickState(layers: ILayer[]) {}
}