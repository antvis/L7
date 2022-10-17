import {
  ILayer,
  IMapService,
  IRendererService,
  ISubLayerInitOptions,
  IBaseTileLayerManager,
} from '@antv/l7-core';
import { Base } from './base';
import { getLayerShape, getMaskValue } from '../utils';
export class BaseMapTileLayerManager extends Base implements IBaseTileLayerManager {
  // only support vector layer
  constructor(
    parent: ILayer,
    mapService: IMapService,
    rendererService: IRendererService,
  ) {
    super();
    this.parent = parent;
    this.children = parent.layerChildren;
    this.mapService = mapService;
    this.rendererService = rendererService;


    this.setSubLayerInitOption();
    this.initTileFactory();
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

  private setSubLayerInitOption() {
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
}
