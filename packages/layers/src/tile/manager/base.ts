import {
    ILayer,
    IRendererService,
    IMapService,
    ISubLayerInitOptions,
    createLayerContainer,
  } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { ITileFactory, getTileFactory, TileType } from '../tileFactory';
export class Base {
    public sourceLayer: string;
    public parent: ILayer;
    public children: ILayer[];
    public mapService: IMapService;
    public rendererService: IRendererService;
    protected tileFactory: ITileFactory;
    protected initOptions: ISubLayerInitOptions;

    private tileCache: Map<string, Tile> = new Map()

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
        layers: [],
        layerIDList: [],
      }
      // 存储当前 tile
      this.tileCache.set(tile.key, tile);

      // 创建 tile 对应的 layers
      const layerCollections = this.tileFactory.createTile(tile, this.initOptions);
      
      tile.layerIDList.push(...layerCollections.layerIDList);
      // 初始化图层
      await this.initTileLayers(layerCollections.layers,tile);
      return layerCollections;
    }

    public removeTile(tile: Tile){
      this.tileCache.delete(tile.key);
      this.removeChildren(tile.layerIDList, false);
    }

    public addChild(layer: ILayer) {
        this.children.push(layer);
    }

    public addChildren(layers: ILayer[]) {
        this.children.push(...layers);
    }

    public removeChildren(layerIDList: string[], refresh = true) {
        const remveLayerList: ILayer[] = [];
        const cacheLayerList: ILayer[] = [];
        this.children.filter((child) => {
        layerIDList.includes(child.id)
            ? remveLayerList.push(child)
            : cacheLayerList.push(child);
        });
        remveLayerList.map((layer) => layer.destroy(refresh));
        this.children = cacheLayerList;
    }

    public removeChild(layer: ILayer) {
        const layerIndex = this.children.indexOf(layer);
        if (layerIndex > -1) {
        this.children.splice(layerIndex, 1);
        }
        layer.destroy();
    }

    public getChildren(layerIDList: string[]) {
        return this.children.filter((child) => layerIDList.includes(child.id));
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

    public destroy(): void {
    
    }
}