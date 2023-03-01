import { extentPoints, overlapBounds } from '@antv/l7-utils';
import BaseLayer from '../core/BaseLayer';
import { filterByPolygon, listType, ListType } from '../core/helper';
import { IRasterLayerStyleOptions } from '../core/interface';
import { getRectData, projectRect } from '../tile/tileFactory/util';
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
        return this.layerSource.data;
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
    return this.layerSource.data;
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
        // console.log('pickRaster', e)
        resolve(e);
      });
    });
  }

  private pickRaster(points: number[], callback: (data: any[]) => void) {
    const type = listType(points);
    switch (type) {
      case ListType.POINT: // 拾取一个点
        callback([type]);
        break;
      case ListType.POLYGON: // 多边形
        const extent = extentPoints(points); // 获取多边形的范围、包围盒 [minLng, minLat, maxLng, maxLat]
        const coverBoundsData = this.getRasterCoverBounds(extent);
        const pixelBounds = this.mapService.boundsToContainer(extent); // 获取多边形的像素包围盒
        const filterOption = {
          container: this.getContainer(),
          mapService: this.mapService,
          pickingService: this.pickingService,
          polygonPoints: points,
        };
        filterByPolygon(filterOption, [coverBoundsData], pixelBounds, callback);

        break;
      case ListType.BOUNDS: // 拾取矩形
        callback([
          this.getRasterCoverBounds(points as [number, number, number, number]),
        ]);
        break;
      case ListType.ALL:
      case ListType.INVALID:
      default:
        callback([type]);
    }
  }

  // 栅格图层本身的数据范围 [minLng, minLat, maxLng, maxLat]
  private parse() {
    const { data, width, height, coordinates } =
      this.layerSource.data.dataArray[0];
    // 栅格图层本身的数据范围 [minLng, minLat, maxLng, maxLat]
    const rasterBounds = [...coordinates[0], ...coordinates[1]] as [
      number,
      number,
      number,
      number,
    ];
    return [rasterBounds, data, width, height];
  }

  // get cover rect 计算 bounds 与图层的重叠部分
  private getRasterCoverBounds(selectBounds: [number, number, number, number]) {
    // 栅格图层本身的数据范围 width, height 数据的宽高
    const [rasterBounds, data, width, height] = this.parse();
    const coverBounds = overlapBounds(selectBounds, rasterBounds);

    const [minLng, minLat, maxLng, maxLat] = coverBounds;
    // 计算重叠部分的数据坐标
    const [minX, minY] = projectRect(
      [minLng, maxLat],
      width,
      height,
      rasterBounds,
    );
    const [maxX, maxY] = projectRect(
      [maxLng, minLat],
      width,
      height,
      rasterBounds,
    );
    return {
      data: getRectData(data, width, [minX, minY, maxX, maxY]),
      bounds: coverBounds,
      rect: [minX, minY, maxX, maxY], // data rect width, height
    };
  }
}
