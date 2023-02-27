import {
  createLayerContainer,
  ILayer,
  ILayerService,
  IMapService,
  IRendererService,
  ISubLayerInitOptions,
} from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { updateLayersConfig } from '../style/utils';
export class Base {
  public sourceLayer: string;
  public parent: ILayer;
  public children: ILayer[];
  public mapService: IMapService;
  public rendererService: IRendererService;
  protected tileFactory: any;
  protected initOptions: ISubLayerInitOptions;

  private tileCache: Map<string, SourceTile> = new Map();
  private tileLayerCache: Map<string, ILayer[]> = new Map();

  private async initTileLayers(layers: ILayer[], tile: SourceTile) {
    return Promise.all(
      layers.map(async (layer) => {
        const container = createLayerContainer(
          this.parent.sceneContainer as Container,
        );
        layer.setContainer(container, this.parent.sceneContainer as Container);
        await layer.init();
        this.addChild(layer);
        tile.layerLoad();
        this.render();
      }),
    );
  }

  public render() {
    this.parent.renderLayers();
  }

  public hasTile(tile: SourceTile) {
    return this.tileCache.has(tile.key);
  }

  // 添加图层
  public async addTile(tile: SourceTile) {
    // oldTile 存在的时候暂时直接结束
    // TODO：合并不存在的时候
    if (this.hasTile(tile)) {
      return {
        layers: [],
      };
    }
    // 存储当前 tile
    this.tileCache.set(tile.key, tile);

    // 创建 tile 对应的 layers
    const layerCollections = this.tileFactory.createTile(
      tile,
      this.initOptions,
    );

    // // 初始化图层
    await this.initTileLayers(layerCollections.layers, tile);

    this.tileLayerCache.set(tile.key, layerCollections.layers);
    // const visible =  tile.parent ? tile.parent.children.every(t=>this.tileLayerCache.has(t.key)) : true
    // tile.parent?.children.forEach((t)=>{
    //   updateLayersConfig(this.getLayers(t),'visible',visible)
    // })

    return layerCollections;
  }

  public removeTile(tile: SourceTile) {
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

  public removeLayers(layers: ILayer[] = [], refresh = true) {
    this.children = this.children.filter((child) => !layers.includes(child));
    layers.map((layer) => layer.destroy(refresh));
  }

  public removeChild(layer: ILayer) {
    const layerIndex = this.children.indexOf(layer);
    if (layerIndex > -1) {
      this.children.splice(layerIndex, 1);
    }
    layer.destroy();
  }

  public getLayers(tile: SourceTile) {
    if (!tile) {
      return [];
    }
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
    // this.tileFactory = new TileFactory({
    //   parent: this.parent,
    //   mapService: this.mapService,
    //   rendererService: this.rendererService,
    // });
  }

  public getSourceLayer(
    parentParserType: string,
    sourceLayer: string | undefined,
  ) {
    if (parentParserType === 'geojsonvt') {
      return 'geojsonvt';
    } else if (parentParserType === 'testTile') {
      return 'testTile';
    } else {
      return sourceLayer;
    }
  }

  public updateTileVisible(tile: SourceTile, layerService: ILayerService) {
    const layers = this.getLayers(tile);
    if (layers.length === 0) {
      return;
    }
    if (tile.isVisible) {
      // 如果可见直接进行渲染，父级发
      updateLayersConfig(layers, 'visible', tile.isVisible);
    } else {
      // 如果不可见，放大，等到子瓦片渲染完成，缩小：父级渲染成功
      // console.log('updateTileVisible',`${tile.x}_${tile.y}_${tile.z}`,tile.isVisible)
      // console.log(tile);
      // console.log(`子瓦片${tile.x}/${tile.y}/${tile.z}`,tile.children.length)
      // tile.children.forEach((t)=>{
      //   console.log(`${t.x}/${t.y}/${t.z}`)
      // })
      updateLayersConfig(layers, 'visible', tile.isVisible);
    }

    // this.listenLoad(tile, () => {
    //   this.isTileAllLoad(tile) && updateLayersConfig(layers, 'visible', tile.isVisible);
    // })
  }

  public listenLoad(tile: SourceTile, callback: () => void) {
    tile.once('layerLoaded', () => {
      callback();
    });

    tile.children.map((childTile) => {
      childTile.once('layerLoaded', () => {
        callback();
      });
    });

    tile.parent?.once('layerLoaded', () => {
      callback();
    });
  }

  public isTileLoaded(tile: SourceTile) {
    if (tile.isLoad) {
      return true;
    }
    const isLoad = this.getLayers(tile).length === tile.loadedLayers;
    tile.isLoad = isLoad;
    return isLoad;
  }

  public isTileChildLoaded(tile: SourceTile) {
    if (tile.isChildLoad) {
      return true;
    }
    const children = tile.children;
    const isLoad =
      children.filter((child) => this.isTileLoaded(child)).length ===
      children.length;
    tile.isChildLoad = isLoad;
    return isLoad;
  }
  public isTileParentLoaded(tile: SourceTile) {
    const parent = tile.parent;
    if (!parent) {
      return true;
    } else {
      return this.isTileLoaded(parent);
    }
  }

  public isTileAllLoad(tile: SourceTile) {
    const tileLoaded = this.isTileLoaded(tile);
    const tileChildLoaded = this.isTileChildLoaded(tile);
    const tileParentLoaded = this.isTileParentLoaded(tile);
    return tileLoaded && tileChildLoaded && tileParentLoaded;
  }

  public destroy(): void {
    this.tileCache.clear();
    this.tileLayerCache.clear();
  }
}
