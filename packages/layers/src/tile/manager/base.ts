import {
    ILayer,
    IRendererService,
    IMapService,
    ISubLayerInitOptions,
    ILayerService,
  } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { ITileFactory, getTileFactory, TileType } from '../tileFactory';
import { registerLayers } from '../utils';
import { updateLayersConfig } from '../style/utils';
import { EventEmitter } from 'eventemitter3';
export class Base extends EventEmitter{
    public sourceLayer: string;
    public parent: ILayer;
    public children: ILayer[];
    public mapService: IMapService;
    public rendererService: IRendererService;
    protected tileFactory: ITileFactory;
    protected initOptions: ISubLayerInitOptions;

    private tileCache: Map<string, Tile> = new Map();
    private tileLayerCache: Map<string, ILayer[]> = new Map();
    private tileStateCache: Map<string, number> = new Map();
    
    public hasTile(tile: Tile){
      return !!this.tileCache.has(tile.key);
    }

    public addTile(tile: Tile) {
      // oldTile 存在的时候暂时直接结束
      // TODO：合并不存在的时候
      if(this.hasTile(tile)) return {
        layers: [],        
      }
      // 存储当前 tile
      this.tileCache.set(tile.key, tile);

      // 创建 tile 对应的 layers
      const layerCollections = this.tileFactory.createTile(tile, this.initOptions);
      const layers = layerCollections.layers;
      this.tileLayerCache.set(tile.key, layers);
      this.tileStateCache.set(tile.key, -layers.length); // -2、-1、0
      
      // regist layer 将创建出来的 layer 进行注册初始化操作
      registerLayers(this.parent, layerCollections.layers);

      // add layer into layerGroup
      this.addChildren(layers);

      layers.map(layer => {
        layer.once('modelLoaded', () => {
          this.tileLayerLoad(tile);
          this.emit('layerLoad', tile);
        })
      })
      return layerCollections;
    }

    public tileLayerLoad(tile: Tile) {
      const count = this.tileStateCache.get(tile.key)
      if(typeof count === 'number') {
        this.tileStateCache.set(tile.key, count + 1);
      }
    }

    public removeTile(tile: Tile){
      this.tileCache.delete(tile.key);
      this.tileStateCache.delete(tile.key);

      const deleteLayers = this.tileLayerCache.get(tile.key) ||[];
      this.children = this.children.filter(child => !deleteLayers.includes(child));
      deleteLayers.map((layer) => layer.destroy(false));

      this.tileLayerCache.delete(tile.key); 
    }

    public addChild(layer: ILayer) {
        this.children.push(layer);
    }

    public addChildren(layers: ILayer[]) {
      this.children.push(...layers);
    }

    public removeChild(layer: ILayer) {
      const layerIndex = this.children.indexOf(layer);
      if (layerIndex > -1) {
        this.children.splice(layerIndex, 1);
      }
      layer.destroy();
    }

    public getLayers(tile: Tile) {
      return this.tileLayerCache.get(tile.key) || [];
    }

    public getChild(layerID: string) {
        return this.children.filter((child) => child.id === layerID)[0];
    }

    public clearChild() {
        this.children.forEach((layer: any) => {
        layer.destroy();
        });

        this.children.slice(0, this.children.length);
    }

    public hasChild(layer: ILayer) {
        return this.children.includes(layer);
    }

    public initTileFactory() {
        const source = this.parent.getSource();
        const TileFactory = getTileFactory(
          this.parent.type as TileType,
          source.parser,
        );
        this.tileFactory = new TileFactory({
          parent: this.parent,
          mapService: this.mapService,
          rendererService: this.rendererService,
        });
    }

    public getSourceLayer(parentParserType: string, sourceLayer: string|undefined) {
      if(parentParserType === 'geojsonvt') {
        return 'geojsonvt';
      } else if(parentParserType === 'testTile') {
        return 'testTile';
      } else {
        return sourceLayer;
      }
    }

    public isTileLayerLoad(tile: Tile) {
      const count = this.tileStateCache.get(tile.key) as number;
      return count >= 0;
    }
    
    public isTileChildLoaded(tile: Tile) {
      const children = tile.children;
      return children.filter((child) => this.isTileLayerLoad(child)).length === children.length;
    }
    
    public isTileParentLoaded(tile: Tile) {
      const parent = tile.parent;
      if (!parent) {
        return true;
      } else {
        return this.isTileLayerLoad(parent);
      }
    }
    
    public tileAllLoad(tile: Tile, callback: () => void) {
      const timer = window.setInterval(() => {
        const tileLoaded = this.isTileLayerLoad(tile);
        const tileChildLoaded = this.isTileChildLoaded(tile);
        const tileParentLoaded = this.isTileParentLoaded(tile);
        if (tileLoaded && tileChildLoaded && tileParentLoaded) {
          callback();
          window.clearInterval(timer);
        }
      }, 36);
    }
    
    public updateImmediately(layers: ILayer[]) {
      let immediately = true;
      layers.map((layer) => {
        if (layer.type !== 'PointLayer') {
          immediately = false;
        }
      });
      return immediately;
    }

    public updateTileVisible(
      tile: Tile,
      layerService: ILayerService,
    ) {
      const layers = this.tileLayerCache.get(tile.key);

      // empty
      if (!layers || layers.length === 0) return;
    
      // 1. 有些图层可以直接更新 如 点图层
      // 2. 当 tile 瓦片 visible 为 true 的时候直接执行
      if (this.updateImmediately(layers) || tile.isVisible) {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
        return;
      }

      /** 不连续层级的切换 */
      // parent 不存在、children 不显示
      if(!tile.parent && tile.children.length > 0 && !tile.children[0].isVisible) {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
        return;
      }
      // parent children 都不存在
      if(!tile.parent && tile.children.length === 0) {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
        return;
      }
      // parent 存在但是不显示、children 不存在
      if(tile.parent && !tile.parent.isVisible && tile.children.length === 0) {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
        return;
      }
      // parent、children 都存在但是不显示
      if(tile.parent && !tile.parent.isVisible && tile.children.length > 0 && !tile.children[0].isVisible) {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
        return;
      }

      /** 连续层级的切换 */
      // 隐藏当前层级、显示下一层级的瓦片
      if(tile.children.length > 0 && tile.children[0].isVisible) {
        const layers = this.tileLayerCache.get(tile.key) || [];
        this.waitChildren(tile, () => {
          updateLayersConfig(layers, 'visible', tile.isVisible);
          layerService.reRender();
        })
        return;
      }
      // 隐藏当前层级、显示栅格一层级的瓦片
      if(tile.parent && tile.parent.isVisible) {
        this.waitParent(tile, () => {
          updateLayersConfig(layers, 'visible', tile.isVisible);
          layerService.reRender();
        });
        return;
      }

      // console.log('parent', tile.parent, tile.children)
      // TODO: 兜底更新、在瓦片优化完毕后去除
      this.tileAllLoad(tile, () => {
        updateLayersConfig(layers, 'visible', tile.isVisible);
        layerService.reRender();
      });
    
    }

    public waitChildren(tile: Tile, callback: () => void){
      if(this.isTileChildLoaded(tile)) {
        callback();
      } else {
        this.on('layerLoad', (updateTile: Tile) => {
          if(updateTile.key === tile.key && this.isTileChildLoaded(tile)) {
            callback();
          }
        })
      }
    }

    public waitParent(tile: Tile, callback: () =>void) {
      if(this.isTileParentLoaded(tile)) {
        callback();
      } else {
        this.on('layerLoad', (updateTile: Tile) => {
          if(updateTile.key ===  tile.parent?.key && this.isTileParentLoaded(tile)) {
            callback();
          }
        })
      }
    }

    public destroy(): void {
      this.tileCache.clear();
      this.tileLayerCache.clear();
      this.tileStateCache.clear();
    }
}

