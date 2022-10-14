import {
    ILayer,
    IRendererService,
    IMapService,
    ISubLayerInitOptions,
    createLayerContainer,
    ILayerService,
  } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { ITileFactory, getTileFactory, TileType } from '../tileFactory';
import { updateLayersConfig } from '../style/utils';
export class Base {
    public sourceLayer: string;
    public parent: ILayer;
    public children: ILayer[];
    public mapService: IMapService;
    public rendererService: IRendererService;
    protected tileFactory: ITileFactory;
    protected initOptions: ISubLayerInitOptions;

    private tileCache: Map<string, Tile> = new Map();
    private tileLayerCache: Map<string, ILayer[]> = new Map();

    private  async initTileLayers(layers: ILayer[],tile:Tile) {
      layers.map(async (layer) => {
        const container = createLayerContainer(
          this.parent.sceneContainer as Container,
        );
        layer.setContainer(container, this.parent.sceneContainer as Container);
         await layer.init();
         this.addChild(layer);
         tile.layerLoad();

      });

    }
    
    public hasTile(tile: Tile){
      return !!this.tileCache.has(tile.key);
    }

    public async addTile(tile: Tile) {
      // oldTile 存在的时候暂时直接结束
      // TODO：合并不存在的时候
      if(this.hasTile(tile)) return {
        layers: []
      }
      // 存储当前 tile
      this.tileCache.set(tile.key, tile);

      // 创建 tile 对应的 layers
      const layerCollections = this.tileFactory.createTile(tile, this.initOptions);
      
      this.tileLayerCache.set(tile.key, layerCollections.layers);
      // 初始化图层
      await this.initTileLayers(layerCollections.layers,tile);
      return layerCollections;
    }

    public removeTile(tile: Tile){
      this.tileCache.delete(tile.key);
      const layers = this.tileLayerCache.get(tile.key);
      this.tileLayerCache.delete(tile.key);
      this.removeLayers(layers, false);
    }

    public addChild(layer: ILayer) {
        this.children.push(layer);
    }

    public addChildren(layers: ILayer[]) {
        this.children.push(...layers);
    }

    public removeLayers(layers: ILayer[] = [], refresh = true){
      this.children = this.children.filter(child => !layers.includes(child));
      layers.map((layer) => layer.destroy(refresh));
    }

    public removeChild(layer: ILayer) {
      const layerIndex = this.children.indexOf(layer);
      if (layerIndex > -1) {
        this.children.splice(layerIndex, 1);
      }
      layer.destroy();
    }

    public getLayers(tile: Tile){
      if(!tile) return [];
      return this.tileLayerCache.get(tile.key) ||[];
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

    public updateTileVisible(
      tile: Tile,
      layerService: ILayerService,
    ) {

      const layers = this.getLayers(tile);
      if (layers.length === 0) return;
    
      if(tile.isVisible) {
        layerService.reRender();
        return;
      }
     
      this.listenLoad(tile, () => {
        this.isTileAllLoad(tile) && updateLayersConfig(layers, 'visible', tile.isVisible);
      })
    }

    public listenLoad(tile:Tile, callback:() => void) {
      tile.on('layerLoaded', () =>{
        callback();
      })

      tile.children.map(childTile => {
        childTile.on('layerLoaded', () => {
          callback();
        })
      })

      tile.parent?.on('layerLoaded', () => {
        callback();
      })
    }

    public isTileLoaded(tile: Tile) {
      if(tile.isLoad) return true;
      const isLoad = this.getLayers(tile).length === tile.loadedLayers;
      tile.isLoad = isLoad;
      return isLoad;
    }

    public isTileChildLoaded(tile: Tile) {
      if(tile.isChildLoad) return true;
      const children = tile.children;
      const isLoad = children.filter((child) => this.isTileLoaded(child)).length === children.length;
      tile.isChildLoad = isLoad;
      return isLoad;
    }
    public isTileParentLoaded(tile: Tile) {
      const parent = tile.parent;
      if (!parent) {
        return true;
      } else {
        return this.isTileLoaded(parent);
      }
    }

    public isTileAllLoad(tile: Tile){
      const tileLoaded = this.isTileLoaded(tile);
      const tileChildLoaded = this.isTileChildLoaded(tile);
      const tileParentLoaded = this.isTileParentLoaded(tile);
      return tileLoaded && tileChildLoaded &&tileParentLoaded;
    }

    public destroy(): void {
      this.tileCache.clear();
      this.tileLayerCache.clear();
    }
}






