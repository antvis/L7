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
import ImageTileFrag from './shaders/imagetile_frag.glsl';
import ImageTileVert from './shaders/imagetile_vert.glsl';

import Tile from '../utils/Tile';

interface IImageLayerStyleOptions {
  resolution: string;
  maxSourceZoom: number;
}

export default class ImageTileModel extends BaseModel {
  public tileLayer: any;
  public getUninforms(): IModelUniform {
    return {};
  }

  // 临时的瓦片测试方法
  public tile() {
    const [WS, EN] = this.mapService.getBounds();
    const NE = { lng: EN[0], lat: EN[1] };
    const SW = { lng: WS[0], lat: WS[1] };
    this.tileLayer.calCurrentTiles({
      NE,
      SW,
      tileCenter: this.mapService.getCenter(),
      currentZoom: this.mapService.getZoom(),
      minSourceZoom: this.mapService.getMinZoom(),
      minZoom: this.mapService.getMinZoom(),
      maxZoom: this.mapService.getMaxZoom(),
    });
  }

  public initModels() {
    // TODO: 瓦片组件默认在最下层
    this.layer.zIndex = -999;
    const {
      resolution = 'low',
      maxSourceZoom = 17,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;
    const source = this.layer.getSource();
    // 当存在 url 的时候生效
    if (source.data.tileurl) {
      this.tileLayer = new Tile({
        url: source.data.tileurl,
        layerService: this.layerService,
        layer: this.layer,
        resolution,
        maxSourceZoom,
        // Tip: 当前为 default
        crstype: 'epsg3857',
      });

      this.tile();
      let t = new Date().getTime();
      this.mapService.on('mapchange', () => {
        const newT = new Date().getTime();
        const cutT = newT - t;
        t = newT;
        if (cutT < 16) {
          return;
        }
        this.tile();
      });
    }

    return [
      this.layer.buildLayerModel({
        moduleName: 'ImageTileLayer',
        vertexShader: ImageTileVert,
        fragmentShader: ImageTileFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }

  public clearModels() {
    this.tileLayer.removeTiles();
  }

  public buildModels() {
    return this.initModels();
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
