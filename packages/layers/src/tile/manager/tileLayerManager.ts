import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IPickingService,
  IRendererService,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickManager,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-source';
import { IRasterTileLayerStyleOptions } from '../../core/interface';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import { getLayerShape, getMaskValue } from '../utils';
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
    layerService: ILayerService,
  ) {
    this.parent = parent;
    this.children = parent.layerChildren;
    this.tilePickManager = new TilePickManager(
      parent,
      rendererService,
      pickingService,
      this.children,
      layerService,
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
      if (key === 'mask') {
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
    this.tileConfigManager.checkConfig(this.parent);
    this.tilePickManager.normalRenderLayer(this.children);
  }

  public renderPicker(target: IInteractionTarget) {
    return this.tilePickManager.pickTileRenderLayer(this.children, target);
  }

  private setSubLayerInitOptipn() {
    const {
      zIndex = 0,
      opacity = 1,
      mask = false,
      stroke = '#fff',
      strokeWidth = 0,
      strokeOpacity = 1,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;

    const colorValue = this.tileConfigManager.getAttributeScale(
      this.parent,
      'color',
    );
    const sizeValue = this.tileConfigManager.getAttributeScale(
      this.parent,
      'size',
    );
    const source = this.parent.getSource();
    const { layerName, coords, featureId } = source.data.tilesetOptions;
    const layerShape = getLayerShape(this.parent.type, this.parent);

    this.initOptions = {
      layerType: this.parent.type,
      shape: layerShape,
      zIndex,
      opacity,
      layerName,
      coords,
      featureId,
      color: colorValue,
      size: sizeValue,
      mask: getMaskValue(this.parent.type, mask),
      stroke,
      strokeWidth,
      strokeOpacity,
    };
  }

  private setConfigListener() {
    this.tileConfigManager.setConfig('opacity', this.initOptions.opacity);
    this.tileConfigManager.setConfig('zIndex', this.initOptions.zIndex);
    this.tileConfigManager.setConfig('mask', this.initOptions.mask);
    this.tileConfigManager.setConfig('stroke', this.initOptions.stroke);
    this.tileConfigManager.setConfig(
      'strokeWidth',
      this.initOptions.strokeWidth,
    );
    this.tileConfigManager.setConfig(
      'strokeOpacity',
      this.initOptions.strokeOpacity,
    );
    this.tileConfigManager.setConfig(
      'color',
      this.parent.getAttribute('color')?.scale,
    );
    this.tileConfigManager.setConfig(
      'shape',
      this.parent.getAttribute('shape')?.scale,
    );
    this.tileConfigManager.setConfig(
      'size',
      this.parent.getAttribute('size')?.scale,
    );

    this.tileConfigManager.on('updateConfig', (updateConfigs) => {
      updateConfigs.map((key: string) => {
        this.updateStyle(key);
        return '';
      });
    });
  }

  private updateStyle(style: string) {
    let updateValue = null;
    if (style === 'size' || style === 'color' || style === 'shape') {
      const scaleValue = this.parent.getAttribute(style)?.scale;
      if (!scaleValue) {
        return;
      }

      updateValue = scaleValue;
      this.children.map((child) => {
        this.tileFactory.setStyleAttributeField(child, style, scaleValue);
        return '';
      });
    } else {
      const layerConfig = this.parent.getLayerConfig() as IRasterTileLayerStyleOptions;
      if (!(style in layerConfig)) {
        return;
      }
      // @ts-ignore
      const config = layerConfig[style];
      updateValue = config;
      this.updateLayersConfig(this.children, style, config);
    }
    // @ts-ignore
    this.initOptions[style] = updateValue;
  }

  private initTileFactory() {
    const source = this.parent.getSource();
    const TileFactory = getTileFactory(
      this.parent.type as TileType,
      source.parser.type,
    );
    this.tileFactory = new TileFactory({
      parent: this.parent,
    });
  }
}
