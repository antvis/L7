import {
  ILayer,
  IRendererService,
  ISource,
  ISubLayerInitOptions,
  ITileLayerManager,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';

const DefaultSunLayerInitOptions: ISubLayerInitOptions = {
  zIndex: 0,
  opacity: 1,
};

export class TileLayerManager implements ITileLayerManager {
  public parent: ILayer;
  private children: ILayer[];
  private rendererService: IRendererService;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions = DefaultSunLayerInitOptions;
  constructor(parent: ILayer, rendererService: IRendererService) {
    this.parent = parent;
    this.children = parent.layerChildren;
    this.rendererService = rendererService;

    this.setSubLayerInitOptipn();
    this.initTileFactory();
  }

  public createTile(tile: Tile) {
    return this.tileFactory.createTile(tile, this.initOptions);
  }

  public updateLayerConfig(layers: ILayer[], isVisible: boolean) {
    layers.map((layer) => {
      layer.updateLayerConfig({
        visible: isVisible,
      });
    });
  }

  public addChild(layer: ILayer) {
    this.children.push(layer);
  }

  public addChilds(layers: ILayer[]) {
    layers.map((layer) => {
      this.children.push(layer);
    });
  }

  public removeChilds(layerIDList: string[]) {
    const remveLayerList: ILayer[] = [];
    const cacheLayerList: ILayer[] = [];
    this.children.filter((child) => {
      layerIDList.includes(child.id)
        ? remveLayerList.push(child)
        : cacheLayerList.push(child);
    });
    remveLayerList.map((layer) => layer.destroy());
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
      .filter((childlayer) => childlayer.inited)
      .filter((childlayer) => childlayer.isVisible())
      .sort((pre: ILayer, next: ILayer) => {
        // 根据 zIndex 对渲染顺序进行排序
        return pre.zIndex - next.zIndex;
      })
      .map((layer) => {
        layer.hooks.beforeRenderData.call();
        layer.hooks.beforeRender.call();
        if (!layer.isLayerGroup && layer.masks.length > 0) {
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
      zIndex,
      opacity,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;
    this.initOptions.zIndex = zIndex;
    this.initOptions.opacity = opacity;
  }

  private initTileFactory() {
    const source: ISource = this.parent.getSource();
    const tileType = source.parser.type as TileType;
    const TileFactory = getTileFactory(tileType);
    this.tileFactory = new TileFactory({
      parent: this.parent,
    });
  }
}
