import {
  IInteractionTarget,
  ILayer,
  IMapService,
  IPickingService,
  IRendererService,
  ISubLayerInitOptions,
  ITileLayerManager,
  ITilePickService,
  ITileRenderService,
  ITransform,
  ScaleAttributeType,
} from '@antv/l7-core';
import { TileManager } from './base';
import { generateColorRamp, IColorRamp } from '@antv/l7-utils';
import { getLayerShape, getMaskValue } from '../utils';
import { TileStyleService, ITileStyleService } from '../style/TileStyleService';
import { TilePickService } from '../interaction/TilePickService';

import { TileRenderService } from '../render/TileRenderService';
import { styles, IStyles, Attributes } from '../style/constants';
import { updateTexture, updateLayersConfig } from '../style/utils';
export class TileLayerManager extends TileManager implements ITileLayerManager {
  public tilePickService: ITilePickService;
  public tileStyleService: ITileStyleService;
  public tileRenderService: ITileRenderService
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

    this.tileRenderService = new TileRenderService(rendererService);

    this.tilePickService = new TilePickService(
      parent,
      rendererService,
      pickingService,
      this.children,
      this.tileRenderService
    );
    this.tileStyleService = new TileStyleService();

    this.setSubLayerInitOption();
    this.setConfigListener();
    this.initTileFactory();
  }

  public render(): void {
    this.tileStyleService.checkConfig(this.parent);
    this.tileRenderService.render(this.children);
  }

  public pickLayers(target: IInteractionTarget) {
    return this.tilePickService.pick(this.children, target);
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

    const colorValue = this.tileStyleService.getAttributeScale(
      this.parent,
      'color',
    );
    const sizeValue = this.tileStyleService.getAttributeScale(
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

  private getInitOptionValue(field: string) {
    switch(field) {
      case 'color': return this.parent.getAttribute('color')?.scale;
      case 'shape': return this.parent.getAttribute('shape')?.scale;
      case 'size': return this.parent.getAttribute('size')?.scale;
      // @ts-ignore
      default: return this.initOptions[field];
    }
  }

  private setInitOptionValue(field: string, value: any) {
    // @ts-ignore
    this.initOptions[field] = value;
  }

  private setConfigListener() {
    const styleConfigs = styles[this.parent.type as IStyles] || [];
    styleConfigs.map(style => {
      this.tileStyleService.setConfig(style, this.getInitOptionValue(style));
    })

    this.tileStyleService.on('updateConfig', (updateConfigs) => {
      updateConfigs.map((key: string) => {
        return this.updateStyle(key);
      });
    });
  }

  private updateAttribute(style: string) {
    if(Attributes.includes(style)) {
      const scaleValue = this.parent.getAttribute(style)?.scale;
      if (!scaleValue) {
        return;
      }
      this.children.map((child) => {
        return this.tileStyleService.setStyleAttributeField(
          child,
          this.parent,
          style as ScaleAttributeType,
          scaleValue,
        );
      });
    }
  }

  private updateStyle(style: string) {
    let updateValue = null;
    if (Attributes.includes(style)) {
      this.updateAttribute(style);
    } else {
      const layerConfig = this.parent.getLayerConfig() as ISubLayerInitOptions;
      if (!(style in layerConfig)) {
        return;
      }
      // @ts-ignore
      const config = layerConfig[style];
      updateValue = config;
      switch(style) {
        case 'rampColors': 
          const texture = updateTexture(config,  this.children, this.rendererService)
          this.initOptions.colorTexture = texture;
          break;
        default: 
          updateLayersConfig(this.children, style, config);
      }
    }
   
    this.setInitOptionValue(style, updateValue);
  }

  public destroy(): void {
    this.tilePickService.destroy();
  }
}
