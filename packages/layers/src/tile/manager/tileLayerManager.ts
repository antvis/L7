import {
  IInteractionTarget,
  ILayer,
  IMapService,
  IPickingService,
  IRendererService,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickManager,
  ITransform,
  ScaleAttributeType,
} from '@antv/l7-core';
import { TileManager } from './baseTileManager';
import { generateColorRamp, IColorRamp } from '@antv/l7-utils';
import { getLayerShape, getMaskValue, updateLayersConfig } from '../utils';
import TileConfigManager, { ITileConfigManager } from './tileConfigManager';
import TilePickManager from './tilePickerManager';
export class TileLayerManager extends TileManager implements ITileLayerManager {
  public tilePickManager: ITilePickManager;
  public tileConfigManager: ITileConfigManager;
  private transforms: ITransform[];
  constructor(
    parent: ILayer,
    mapService: IMapService,
    rendererService: IRendererService,
    pickingService: IPickingService,
    transforms: ITransform[]
  ) {
    super();
    this.parent = parent;
    this.children = parent.layerChildren;
    this.mapService = mapService;
    this.rendererService = rendererService;
    this.transforms = transforms;

    this.tilePickManager = new TilePickManager(
      parent,
      rendererService,
      pickingService,
      this.children,
    );
    this.tileConfigManager = new TileConfigManager();

    this.setSubLayerInitOption();
    this.setConfigListener();
    this.initTileFactory();
  }

  public render(): void {
    this.tileConfigManager?.checkConfig(this.parent);
    this.tilePickManager?.normalRender(this.children);
  }

  public pickLayers(target: IInteractionTarget) {
    return this.tilePickManager?.pickRender(this.children, target);
  }

  private setSubLayerInitOption() {
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
      workerEnabled = false,
      sourceLayer,

      pixelConstant = 0,
      pixelConstantR = 256 * 256,
      pixelConstantG = 256,
      pixelConstantB = 1,
      pixelConstantRGB = 0.1,
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
    const parentParserType = source.getParserType();

    const layerShape = getLayerShape(this.parent.type, this.parent);


    this.initOptions = {
      layerType: this.parent.type,
      transforms: this.transforms,
      shape: layerShape,
      zIndex,
      opacity,
      sourceLayer: this.getSourceLayer(parentParserType, sourceLayer),
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
      // worker
      workerEnabled,

      pixelConstant,
      pixelConstantR,
      pixelConstantG,
      pixelConstantB,
      pixelConstantRGB,
    };
    if (rampColors) {
      // 构建统一的色带贴图
      const { createTexture2D } = this.rendererService;
      const imageData = generateColorRamp(rampColors as IColorRamp) as ImageData;
      const colorTexture = createTexture2D({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
        flipY: false,
      });
      this.initOptions.colorTexture = colorTexture;
    }
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

      this.tileConfigManager.setConfig(
        'pixelConstant',
        this.initOptions.pixelConstant,
      );
      this.tileConfigManager.setConfig(
        'pixelConstantR',
        this.initOptions.pixelConstantR,
      );
      this.tileConfigManager.setConfig(
        'pixelConstantG',
        this.initOptions.pixelConstantG,
      );
      this.tileConfigManager.setConfig(
        'pixelConstantB',
        this.initOptions.pixelConstantB,
      );
      this.tileConfigManager.setConfig(
        'pixelConstantRGB',
        this.initOptions.pixelConstantRGB,
      );
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
      updateLayersConfig(this.children, style, config);
      if (style === 'rampColors' && config) {
        const { createTexture2D } = this.rendererService;
        const imageData = generateColorRamp(config as IColorRamp) as ImageData;
        this.initOptions.colorTexture = createTexture2D({
          data: imageData.data,
          width: imageData.width,
          height: imageData.height,
          flipY: false,
        });
        updateLayersConfig(this.children, 'colorTexture', this.initOptions.colorTexture);
      }
    }
    // @ts-ignore
    this.initOptions[style] = updateValue;
  }

  public destroy(): void {
    this.tilePickManager.destroy();
  }
}
