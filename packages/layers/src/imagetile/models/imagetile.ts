import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IModel,
  IModelUniform,
  IRasterParserDataItem,
  IStyleAttributeService,
  ITexture2D,
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/image_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';

import { calCurrentTiles } from '../utils/cal';

interface IImageLayerStyleOptions {
  opacity: number;
}
export default class ImageTileModel extends BaseModel {
  protected tileList: {} = {};
  protected updateTileList: [] = [];

  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const { opacity } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
    };
  }

  // 临时的瓦片测试方法
  public tile() {
    // @ts-ignore
    const viewPort = this.mapService.map.getBounds().toBounds();
    // Tip: 目前只有 amap 1.x 支持这样获取值
    const NE = viewPort.getNorthEast();
    const SW = viewPort.getSouthWest();

    calCurrentTiles({
      NE,
      SW,
      tileCenter: this.mapService.getCenter(),
      tileZoom: this.mapService.getZoom(),
      crstype: 'epsg3857',
      tileList: this.tileList,
      updateTileList: this.updateTileList,
      minZoom: this.mapService.getMinZoom(),
      maxZoom: this.mapService.getMaxZoom(),
    });
  }

  public initModels() {
    this.tile();
    // @ts-ignore 目前只有 amap 1.x 支持这样监听地图变化
    this.mapService.map.on('camerachange', () => {
      this.tile();
    });

    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    source.data.images.then((imageData: HTMLImageElement[]) => {
      this.texture = createTexture2D({
        data: imageData[0],
        width: imageData[0].width,
        height: imageData[0].height,
      });
      this.layerService.renderLayers();
    });
    return [
      this.layer.buildLayerModel({
        moduleName: 'RasterImage',
        vertexShader: ImageVert,
        fragmentShader: ImageFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }
  public buildModels() {
    return this.initModels();
  }

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
