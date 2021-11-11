import { gl, IModelUniform } from '@antv/l7-core';
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

  // 瓦片方法
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

      // TODO: 首次加载的时候请求瓦片
      this.tile();

      let t = new Date().getTime();
      this.mapService.on('mapchange', () => {
        const newT = new Date().getTime();
        const cutT = newT - t;
        t = newT;
        // TODO: 限制刷新频率
        if (cutT < 16) {
          return;
        }
        // TODO: 瓦片地图最大层级为 2
        if (this.mapService.getZoom() < 2.0) {
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
    return;
  }
}
