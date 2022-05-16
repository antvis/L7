import {
  IInteractionTarget,
  ILayer,
  IPickingService,
  IRendererService,
  IScaleValue,
  ISource,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickManager,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { IRasterTileLayerStyleOptions } from '../../core/interface';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import TileConfigManager, { ITileConfigManager } from './tileConfigManager';
import TilePickManager from './tilePickerManager';
export class TileLayerManager implements ITileLayerManager {
  public layerName: string;
  public parent: ILayer;
  public children: ILayer[];
  public tilePickManager: ITilePickManager;
  public tileConfigManager: ITileConfigManager;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions;
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
    this.tileConfigManager = new TileConfigManager();

    this.setSubLayerInitOptipn();
    this.setConfigListener();
    this.initTileFactory();
  }

  public createTile(tile: Tile) {
    return this.tileFactory.createTile(tile, this.initOptions);
  }

  public updateLayersConfig(layers: ILayer[], key: string, value: any) {
    layers.map((layer) => {
      layer.updateLayerConfig({
        [key]: value,
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
      this.tileConfigManager.checkConfig(this.parent);
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
      zIndex = 0,
      opacity = 1,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;
    const colorValue = this.tileConfigManager.getAttributeScale(
      this.parent,
      'color',
    );
    this.initOptions = {
      zIndex,
      opacity,
      layerName: this.parent.name,
      color: colorValue,
    };
  }

  private setConfigListener() {
    const {
      zIndex = 0,
      opacity = 1,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;

    this.tileConfigManager.setConfig('opacity', opacity);
    this.tileConfigManager.setConfig('zIndex', zIndex);
    this.tileConfigManager.setConfig(
      'color',
      this.parent.getAttribute('color')?.scale,
    );

    this.tileConfigManager.on('updateConfig', (updateConfigs) => {
      const layerConfig = this.parent.getLayerConfig() as IRasterTileLayerStyleOptions;
      updateConfigs.map((key: string) => {
        if (key === 'color' || key === 'size') {
          const scaleValue = this.parent.getAttribute(key)?.scale;
          if(key === 'color' && scaleValue) {
            this.children.map((child) => {
              this.tileFactory.setColor(child, scaleValue);
              return '';
            });
          }
         if(key === 'size' && scaleValue) {
          this.children.map((child) => {
            this.tileFactory.setSize(child, scaleValue);
            return '';
          });
         }
            
          return;
        }
        // @ts-ignore
        const config = layerConfig[key];
        this.updateLayersConfig(this.children, key, config);
        return '';
      });
    });
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
