import { IModelUniform } from '@antv/l7-core';
import { IRasterTileParserCFG } from '@antv/l7-source';
import BaseModel from '../../core/BaseModel';
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
    this.layer.zIndex = -999;
    const source = this.layer.getSource();
    const {
      tileSize,
      maxZoom,
      minZoom,
      zoomOffset,
      extent,
    } = source.data as IRasterTileParserCFG;

    this.tileLayer = new Tile({
      url: source.data.url,
      layerService: this.layerService,
      layer: this.layer,
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

    return [];
  }

  public clearModels() {
    this.tileLayer.removeTiles();
  }

  public buildModels() {
    return this.initModels();
  }

  protected registerBuiltinAttributes() {
    //
  }
}
