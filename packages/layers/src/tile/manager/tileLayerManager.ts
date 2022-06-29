import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IMapService,
  IPickingService,
  IRendererService,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickManager,
  ScaleAttributeType,
} from '@antv/l7-core';
import { generateColorRamp, IColorRamp, Tile } from '@antv/l7-utils';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import { getLayerShape, getMaskValue } from '../utils';
import TileConfigManager, { ITileConfigManager } from './tileConfigManager';
import TilePickManager from './tilePickerManager';
export class TileLayerManager implements ITileLayerManager {
  public sourceLayer: string;
  public parent: ILayer;
  public children: ILayer[];
  public mapService: IMapService;
  public rendererService: IRendererService;
  public tilePickManager: ITilePickManager;
  public tileConfigManager: ITileConfigManager;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions;
  private rampColorsData: any;
  constructor(
    parent: ILayer,
    mapService: IMapService,
    rendererService: IRendererService,
    pickingService: IPickingService,
    layerService: ILayerService,
  ) {
    this.parent = parent;
    this.children = parent.layerChildren;
    this.mapService = mapService;
    this.rendererService = rendererService;
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
    this.tileConfigManager?.checkConfig(this.parent);
    this.tilePickManager?.normalRender(this.children);
  }

  public pickLayers(target: IInteractionTarget) {
    return this.tilePickManager?.pickRender(this.children, target);
  }

  private setSubLayerInitOptipn() {
    const {
      zIndex = 0,
      opacity = 1,
      mask = false,
      stroke = '#fff',
      strokeWidth = 0,
      strokeOpacity = 1,

      clampLow = true,
      clampHigh = true,
      domain = [0, 1],
      rampColors = {
        colors: [
          'rgb(166,97,26)',
          'rgb(223,194,125)',
          'rgb(245,245,245)',
          'rgb(128,205,193)',
          'rgb(1,133,113)',
        ],
        positions: [0, 0.25, 0.5, 0.75, 1.0],
      },
      featureId = 'id',
      sourceLayer,
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
    const { coords } = source?.data?.tilesetOptions || {};

    const layerShape = getLayerShape(this.parent.type, this.parent);

    if (rampColors) {
      // 构建统一的色带贴图
      this.rampColorsData = generateColorRamp(rampColors as IColorRamp);
    }

    this.initOptions = {
      layerType: this.parent.type,
      shape: layerShape,
      zIndex,
      opacity,
      sourceLayer,
      coords,
      featureId,
      color: colorValue,
      size: sizeValue,
      mask: getMaskValue(this.parent.type, mask),
      stroke,
      strokeWidth,
      strokeOpacity,
      // raster tiff
      clampLow,
      clampHigh,
      domain,
      rampColors,
      rampColorsData: this.rampColorsData,
    };
  }

  private setConfigListener() {
    // RasterLayer PolygonLayer LineLayer PointLayer
    // All Tile Layer Need Listen
    this.tileConfigManager.setConfig('opacity', this.initOptions.opacity);
    this.tileConfigManager.setConfig('zIndex', this.initOptions.zIndex);
    this.tileConfigManager.setConfig('mask', this.initOptions.mask);

    if (this.parent.type === 'RasterLayer') {
      // Raster Tile Layer Need Listen
      this.tileConfigManager.setConfig(
        'rampColors',
        this.initOptions.rampColors,
      );
      this.tileConfigManager.setConfig('domain', this.initOptions.domain);
      this.tileConfigManager.setConfig('clampHigh', this.initOptions.clampHigh);
      this.tileConfigManager.setConfig('clampLow', this.initOptions.clampLow);
    } else {
      // Vector Tile Layer Need Listen
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
    }

    this.tileConfigManager.on('updateConfig', (updateConfigs) => {
      updateConfigs.map((key: string) => {
        this.updateStyle(key);
        return '';
      });
    });
  }

  private updateStyle(style: string) {
    let updateValue = null;
    if (['size', 'color', 'shape'].includes(style)) {
      const scaleValue = this.parent.getAttribute(style)?.scale;
      if (!scaleValue) {
        return;
      }
      updateValue = scaleValue;
      this.children.map((child) => {
        this.tileFactory.setStyleAttributeField(
          child,
          style as ScaleAttributeType,
          scaleValue,
        );
        return '';
      });
    } else {
      const layerConfig = this.parent.getLayerConfig() as ISubLayerInitOptions;
      if (!(style in layerConfig)) {
        return;
      }
      // @ts-ignore
      const config = layerConfig[style];
      updateValue = config;
      this.updateLayersConfig(this.children, style, config);
      if (style === 'rampColors' && config) {
        this.rampColorsData = generateColorRamp(config as IColorRamp);
      }
    }
    // @ts-ignore
    this.initOptions[style] = updateValue;
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
