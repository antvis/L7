import {
  AttributeType,
  gl,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getCullFace, getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';

import point_tile_frag from '../shaders/tile/fill_tile_frag.glsl';
import point_tile_vert from '../shaders/tile/fill_tile_vert.glsl';

import { Version } from '@antv/l7-maps';
export default class FillModel extends BaseModel {
  public meter2coord: number = 1;
  private isMeter: boolean = false;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = 'rgba(0,0,0,0)',
      offsets = [0, 0],
      blend,
      blur = 0,
      coord = 'lnglat',
      tileOrigin,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({
        opacity,
        strokeOpacity,
        strokeWidth,
        stroke,
        offsets,
      })
    ) {
      // 判断当前的样式中哪些是需要进行数据映射的，哪些是常量，同时计算用于构建数据纹理的一些中间变量
      this.judgeStyleAttributes({
        opacity,
        strokeOpacity,
        strokeWidth,
        stroke,
        offsets,
      });

      const encodeData = this.layer.getEncodedData();
      const { data, width, height } = this.calDataFrame(
        this.cellLength,
        encodeData,
        this.cellProperties,
      );
      this.rowCount = height; // 当前数据纹理有多少行

      this.dataTexture =
        this.cellLength > 0 && data.length > 0
          ? this.createTexture2D({
              flipY: true,
              data,
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width,
              height,
            })
          : this.createTexture2D({
              flipY: true,
              data: [1],
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width: 1,
              height: 1,
            });
    }
    return {
      u_tileOrigin: tileOrigin || [0, 0],
      u_coord: coord === 'lnglat' ? 1.0 : 0.0,

      u_isMeter: Number(this.isMeter),
      u_blur: blur,

      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_opacity: Number(opacity),
      u_stroke_opacity: Number(strokeOpacity),
      u_stroke_width: Number(strokeWidth),
      u_stroke_color: this.getStrokeColor(stroke),
      u_offsets: this.isOffsetStatic(offsets)
        ? (offsets as [number, number])
        : [0, 0],
    };
  }

  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    return this.styleAttributeService.createAttributesAndIndices(
      this.layer.getEncodedData(),
      PointFillTriangulation,
    );
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    const {
      unit = 'l7size',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const { version } = this.mapService;
    if (
      unit === 'meter' &&
      version !== Version.L7MAP &&
      version !== Version.GLOBEL
    ) {
      this.isMeter = true;
      this.calMeter2Coord();
    }

    this.buildModels(callbackModel);
  }

  /**
   * 计算等面积点图层（unit meter）笛卡尔坐标标度与世界坐标标度的比例
   * @returns
   */
  public calMeter2Coord() {
    const [minLng, minLat, maxLng, maxLat] = this.layer.getSource().extent;
    const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

    const { version } = this.mapService;
    if (version === Version.MAPBOX && window.mapboxgl.MercatorCoordinate) {
      const coord = window.mapboxgl.MercatorCoordinate.fromLngLat(
        { lng: center[0], lat: center[1] },
        0,
      );
      const offsetInMeters = 1;
      const offsetInMercatorCoordinateUnits =
        offsetInMeters * coord.meterInMercatorCoordinateUnits();
      const westCoord = new window.mapboxgl.MercatorCoordinate(
        coord.x - offsetInMercatorCoordinateUnits,
        coord.y,
        coord.z,
      );
      const westLnglat = westCoord.toLngLat();

      this.meter2coord = center[0] - westLnglat.lng;
      return;
    }

    // @ts-ignore
    const m1 = this.mapService.meterToCoord(center, [minLng, minLat]);
    // @ts-ignore
    const m2 = this.mapService.meterToCoord(center, [
      maxLng === minLng ? maxLng + 0.1 : maxLng,
      maxLat === minLat ? minLat + 0.1 : maxLat,
    ]);
    this.meter2coord = (m1 + m2) / 2;
    if (!Boolean(this.meter2coord)) {
      // Tip: 兼容单个数据导致的 m1、m2 为 NaN
      this.meter2coord = 7.70681090738883;
    }
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
      workerEnabled = false,
    } = this.layer.getLayerConfig() as Partial<
      ILayerConfig & IPointLayerStyleOptions
    >;

    this.layer.triangulation = PointFillTriangulation;
    this.layer
      .buildLayerModel({
        moduleName: 'pointTile',
        vertexShader: point_tile_vert,
        fragmentShader: point_tile_frag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        cull: {
          enable: true,
          face: getCullFace(this.mapService.version),
        },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        workerEnabled,
        workerOptions: {
          modelType: 'pointTile',
        },
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  // overwrite baseModel func
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];

          const extrudeIndex = (attributeIdx % 4) * 3;
          return [
            extrude[extrudeIndex],
            extrude[extrudeIndex + 1],
            extrude[extrudeIndex + 2],
          ];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 5 } = feature;
          // console.log('featureIdx', featureIdx, feature)
          return Array.isArray(size)
            ? [size[0] * this.meter2coord]
            : [(size as number) * this.meter2coord];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'shape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Shape',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { shape = 2 } = feature;
          const shape2d = this.layer.getLayerConfig().shape2d as string[];
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }
}
