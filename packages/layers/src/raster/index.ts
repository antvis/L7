import { extentPoints, IPointsType, pointsType } from '@antv/l7-utils';
import BaseLayer from '../core/BaseLayer';
import { filterByPolygon, ICoverRect } from '../core/helper';
import { IRasterLayerStyleOptions } from '../core/interface';
import RasterModels, { RasterModelType } from './models/index';
export default class RaterLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  public async buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new RasterModels[modelType](this);
    await this.initLayerModels();
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      raster: {},
      rasterRgb: {},
      raster3d: {},
      rasterTerrainRgb: {},
    };
    return defaultConfig[type];
  }

  /**
   * 重写获取数据的方法
   * @param bounds
   * @returns
   */
  public getData(bounds: number[]) {
    const type = this.getModelType();
    switch (type) {
      case 'raster':
        return this.getRasterData(bounds);
      case 'rasterRgb':
        return this.getRasterRGBData(bounds);
      default:
        return Promise.resolve(this.layerSource.data);
    }
  }

  public getModelType(): RasterModelType {
    // 根据 source 的类型判断 model type
    const parserType = this.layerSource.getParserType();
    switch (parserType) {
      case 'raster':
        return 'raster';
      case 'rasterRgb':
        return 'rasterRgb';
      case 'image':
        return 'rasterTerrainRgb';
      default:
        return 'raster';
    }
  }

  // TODO: 临时写法，后续需要重构
  private getRasterRGBData(bounds: number[]) {
    return Promise.resolve(this.layerSource.data);
  }

  /**
   *
   * @param points 用来截取数据的框
   * @returns
   */
  private getRasterData(points: number[]) {
    return new Promise((resolve) => {
      if (!this.layerSource?.data?.dataArray[0]) {
        console.warn('raster data is empty');
        resolve({
          data: [],
          bounds: [],
          rect: [],
        });
        return;
      }
      this.pickRaster(points, (e) => {
        resolve(e);
      });
    });
  }

  private pickRaster(points: number[], callback: (data: any[]) => void) {
    const type = pointsType(points);
    switch (type) {
      case IPointsType.POINT: // 拾取一个点
        callback([type]);
        break;
      case IPointsType.POLYGON: // 多边形
        const extent = extentPoints(points); // 获取多边形的范围、包围盒 [minLng, minLat, maxLng, maxLat]
        const covers = this.getCoverOptions(extent);
        const pixelBounds = this.mapService.boundsToContainer(extent); // 获取多边形的像素包围盒
        const filterOption = {
          container: this.getContainer(),
          pickingService: this.pickingService,
          polygonPoints: points,
          maskLayers: this.masks, // 增加 mask 层过滤
        };
        filterByPolygon(filterOption, covers, pixelBounds, callback);
        break;
      case IPointsType.BOUNDS: // 拾取矩形
        const boundsCovers = this.getCoverOptions(points);
        const boundsSelect = boundsCovers.map((cover) => {
          return {
            ...cover,
            data: cover.source?.getData(cover.rect),
          };
        });
        callback(boundsSelect);
        break;
      default:
        callback([type]);
    }
  }

  private getCoverOptions(lngLatBounds: number[]) {
    const source = this.getSource();
    const covers = this.getCoverRects(
      lngLatBounds as [number, number, number, number],
    );
    covers.forEach((cover) => {
      const { bounds: coverBounds, rect: polygonRect } = cover;
      cover.coverPixelsBounds = this.mapService.boundsToContainer(
        coverBounds as number[],
      );
      cover.bounds = coverBounds as number[];
      cover.rect = polygonRect;
      cover.source = source;
    });
    return covers;
  }

  // get cover rect 计算 bounds 与图层的重叠部分
  private getCoverRects(
    coverBounds: [number, number, number, number],
  ): ICoverRect[] {
    // 返回重叠部分的范围参数
    const cover = this.getSource().coverRect(coverBounds);
    return [cover];
  }
}
