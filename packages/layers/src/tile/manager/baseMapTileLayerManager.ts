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
  ITransform,
} from '@antv/l7-core';
import { generateColorRamp, IColorRamp, Tile } from '@antv/l7-utils';
import { getTileFactory, ITileFactory, TileType } from '../tileFactory';
import { getLayerShape, getMaskValue } from '../utils';
import TilePickManager from './tilePickerManager';
export class BaseMapTileLayerManager implements ITileLayerManager {
  public sourceLayer: string;
  public parent: ILayer;
  public children: ILayer[];
  public mapService: IMapService;
  public rendererService: IRendererService;
  public tilePickManager: ITilePickManager;
  private tileFactory: ITileFactory;
  private initOptions: ISubLayerInitOptions;
  private rampColorsData: any;
  private transforms: ITransform[];
  constructor(
    parent: ILayer,
    mapService: IMapService,
    rendererService: IRendererService,
    pickingService: IPickingService,
    layerService: ILayerService,
    transforms: ITransform[]
  ) {
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
      layerService,
    );

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
    this.tilePickManager?.normalRender(this.children);
  }

  public pickLayers(target: IInteractionTarget) {
    return false;
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
      workerEnabled = false,
      sourceLayer,

      pixelConstant = 0,
      pixelConstantR = 256 * 256,
      pixelConstantG = 256,
      pixelConstantB = 1,
      pixelConstantRGB = 0.1,
    } = this.parent.getLayerConfig() as ISubLayerInitOptions;
   
    const source = this.parent.getSource();
    const parentParserType = source.getParserType();

  
    const colorAttribute = this.parent.getAttribute('color');
    const basemapColor = (colorAttribute?.scale?.field || '#fff') as string;
    const sizeAttribute = this.parent.getAttribute('size');
    const basemapSize = (sizeAttribute?.scale?.field || 1) as number;
 
    const layerShape = getLayerShape(this.parent.type, this.parent);

    if (rampColors) {
      // 构建统一的色带贴图
      this.rampColorsData = generateColorRamp(rampColors as IColorRamp);
    }

    this.initOptions = {
      usage: 'basemap',
      layerType: this.parent.type,
      transforms: this.transforms,
      shape: layerShape,
      zIndex,
      opacity,
      sourceLayer: this.getSourceLayer(parentParserType, sourceLayer),
      featureId: undefined,
      basemapColor,
      basemapSize,
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
      // worker
      workerEnabled,

      pixelConstant,
      pixelConstantR,
      pixelConstantG,
      pixelConstantB,
      pixelConstantRGB,
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
