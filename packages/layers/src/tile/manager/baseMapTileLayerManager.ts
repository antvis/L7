import {
  ILayer,
  IMapService,
  IRendererService,
  ISubLayerInitOptions,
  IBaseTileLayerManager,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import { getLayerShape, getMaskValue } from '../utils';
export class BaseMapTileLayerManager implements IBaseTileLayerManager {
  // only support vector layer
  public sourceLayer: string;
  public parent: ILayer;
  public children: ILayer[];
  public mapService: IMapService;
  public rendererService: IRendererService;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions;
  constructor(
    parent: ILayer,
    mapService: IMapService,
    rendererService: IRendererService,
  ) {
    this.parent = parent;
    this.children = parent.layerChildren;
    this.mapService = mapService;
    this.rendererService = rendererService;


    this.setSubLayerInitOptipn();
    this.initTileFactory();
  }

  public createTile(tile: Tile) {
    return this.tileFactory.createTile(tile, this.initOptions);
  }

  public updateLayersConfig(layers: ILayer[], key: string, value: any) {
    layers.map((layer) => {
      if (key === 'mask') {
        // Tip: 栅格瓦片生效、设置全局的 mask、瓦片被全局的 mask 影响
        layer.style({
          mask: value,
        });
      } else {
        layer.updateLayerConfig({
          [key]: value,
        });
      }
    });
  }

  public addChild(layer: ILayer) {
    this.children.push(layer);
  }

  public addChilds(layers: ILayer[]) {
    this.children.push(...layers);
  }

  public removeChilds(layerIDList: string[], refresh = true) {
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

  public getChilds(layerIDList: string[]) {
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

  public render(): void {
    this.children
    .filter((layer) => layer.inited)
    .filter((layer) => layer.isVisible())
    .map((layer) => {
      layer.hooks.beforeRenderData.call();
      layer.hooks.beforeRender.call();
      if (layer.masks.length > 0) {
        // 清除上一次的模版缓存
        this.rendererService.clear({
          stencil: 0,
          depth: 1,
          framebuffer: null,
        });
        layer.masks.map((m: ILayer) => {
          m.hooks.beforeRenderData.call();
          m.hooks.beforeRender.call();
          m.render();
          m.hooks.afterRender.call();
        });
      }
      layer.render();
      layer.hooks.afterRender.call();
    });
  }

  private setSubLayerInitOptipn() {
    const {
      zIndex = 0,
      opacity = 1,
      mask = false,
      stroke = '#fff',
      strokeWidth = 0,
      strokeOpacity = 1,
 
      workerEnabled = false,
      sourceLayer,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;
   
    const source = this.parent.getSource();
    const parentParserType = source.getParserType();
  
    const colorAttribute = this.parent.getAttribute('color');
    const basemapColor = (colorAttribute?.scale?.field || '#fff') as string;
    const sizeAttribute = this.parent.getAttribute('size');
    const basemapSize = (sizeAttribute?.scale?.field || 1) as number;

    const layerShape = getLayerShape(this.parent.type, this.parent);

    this.initOptions = {
      usage: 'basemap',
      layerType: this.parent.type,
      shape: layerShape,
      zIndex,
      opacity,
      sourceLayer: this.getSourceLayer(parentParserType, sourceLayer),
      basemapColor,
      basemapSize,
      mask: getMaskValue(this.parent.type, mask),
      stroke,
      strokeWidth,
      strokeOpacity,
      // worker
      workerEnabled,
    };
  }

  private getSourceLayer(parentParserType: string, sourceLayer: string|undefined) {
    if(parentParserType === 'geojsonvt') {
      return 'geojsonvt';
    } else if(parentParserType === 'testTile') {
      return 'testTile';
    } else {
      return sourceLayer;
    }
  }

  private initTileFactory() {
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
}
