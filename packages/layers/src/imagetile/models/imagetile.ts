import { gl, IModelUniform } from '@antv/l7-core';
import { ITileParserCFG } from '@antv/l7-source';
import BaseModel from '../../core/BaseModel';
import { ITileLayerStyleOptions } from '../../core/interface';
import Tile from '../utils/Tile';
export default class ImageTileModel extends BaseModel {
  public tileLayer: any;
  private timestamp: number | null;
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
    const source = this.layer.getSource();
    // 当存在 url 的时候生效
    if (source.data.tileUrls) {
      const {
        resolution,
        tileSize,
        maxZoom,
        minZoom,
        zoomOffset,
        extent,
      } = source.data as ITileParserCFG;
      this.tileLayer = new Tile({
        url: source.data.tileUrls[0],
        layerService: this.layerService,
        layer: this.layer,
        resolution,
        maxZoom,
        // Tip: 当前为 default
        crstype: 'epsg3857',
      });

      // TODO: 首次加载的时候请求瓦片
      this.tile();

      this.mapService.on('mapchange', (e) => {
        if (this.timestamp) {
          clearTimeout(this.timestamp);
          this.timestamp = null;
        }
        // @ts-ignore 节流
        this.timestamp = setTimeout(() => {
          // TODO: 瓦片地图最大层级为 2
          if (this.mapService.getZoom() >= 2.0) {
            this.tile();
          }
        }, 500);
      });
    }

    return [];
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
