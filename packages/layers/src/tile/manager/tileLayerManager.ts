import {
  IInteractionTarget,
  ILayer,
  IPickingService,
  IRendererService,
  ISource,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickManager,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import TilePickManager from './tilePickerManager';

const DefaultSunLayerInitOptions: ISubLayerInitOptions = {
  zIndex: 0,
  opacity: 1,
};

export class TileLayerManager implements ITileLayerManager {
  public parent: ILayer;
  public children: ILayer[];
  public tilePickManager: ITilePickManager;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions = DefaultSunLayerInitOptions;
  constructor(
    parent: ILayer,
    rendererService: IRendererService,
    pickingService: IPickingService,
  ) {
    this.parent = parent;
    this.children = parent.layerChildren;
    this.tilePickManager = new TilePickManager(
      rendererService,
      pickingService,
      this.children,
    );
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

  public render(isPicking: false): void {
    if (!isPicking) {
      this.tilePickManager.normalRenderLayer(this.children);
    } else {
      this.tilePickManager.pickRenderLayer(this.children);
    }
  }

  public renderPicker(target: IInteractionTarget) {
    return this.tilePickManager.pickTileRenderLayer(this.children, target);
  }

  private setSubLayerInitOptipn() {
    const {
      zIndex,
      opacity,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;

    // TODO: get vector layer name
    const layerName = 'city';

    this.initOptions.zIndex = zIndex;
    this.initOptions.opacity = opacity;
    if (layerName) {
      this.initOptions.layerName = layerName;
    }
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
