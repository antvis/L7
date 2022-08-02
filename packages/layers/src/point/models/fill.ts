import {
  AttributeType,
  gl,
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { $window, getMask, PointFillTriangulation } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
// import { PointFillTriangulation } from '../../core/triangulation';
// animate pointLayer shader - support animate
import waveFillFrag from '../shaders/animate/wave_frag.glsl';
// static pointLayer shader - not support animate
import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';

import { Version } from '@antv/l7-maps';

export default class FillModel extends BaseModel {
  private meter2coord: number = 1;
  private meteryScale: number = 1; // 兼容 mapbox
  private isMeter: boolean = false;

  private unit: string = 'l7size';
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = 'rgba(0,0,0,0)',
      offsets = [0, 0],
      blend,
      blur = 0,
      raisingHeight = 0,
      unit = 'l7size',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    this.updateUnit(unit);

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
      u_raisingHeight: Number(raisingHeight),

      u_meter2coord: this.meter2coord,
      u_meteryScale: this.meteryScale,
      u_isMeter: Number(this.isMeter),
      u_blur: blur,

      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_stroke_opacity: isNumber(strokeOpacity) ? strokeOpacity : 1.0,
      u_stroke_width: isNumber(strokeWidth) ? strokeWidth : 1.0,
      u_stroke_color: this.getStrokeColor(stroke),
      u_offsets: this.isOffsetStatic(offsets)
        ? (offsets as [number, number])
        : [0, 0],
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const {
      animateOption = { enable: false },
    } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption),
      u_time: this.layer.getLayerAnimateTime(),
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
    this.updateUnit('l7size');
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
    const mapboxContext = $window?.mapboxgl;
    if (version === Version.MAPBOX && mapboxContext?.MercatorCoordinate) {
      // 参考：
      // https://docs.mapbox.com/mapbox-gl-js/api/geography/#mercatorcoordinate#meterinmercatorcoordinateunits
      const coord = mapboxContext.MercatorCoordinate.fromLngLat(
        { lng: center[0], lat: center[1] },
        0,
      );
      const offsetInMercatorCoordinateUnits = coord.meterInMercatorCoordinateUnits();
      const westCoord = new mapboxContext.MercatorCoordinate(
        coord.x - offsetInMercatorCoordinateUnits,
        coord.y,
        coord.z,
      );
      const westLnglat = westCoord.toLngLat();

      const southCoord = new mapboxContext.MercatorCoordinate(
        coord.x,
        coord.y - offsetInMercatorCoordinateUnits,
        coord.z,
      );
      const southLnglat = southCoord.toLngLat();

      this.meter2coord = center[0] - westLnglat.lng;

      this.meteryScale = (southLnglat.lat - center[1]) / this.meter2coord;
      return;
    }

    const m1 = this.mapService.meterToCoord(center, [minLng, minLat]);
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

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
      animateOption = { enable: false },
      workerEnabled = false,
      enablePicking,
      shape2d,
    } = this.layer.getLayerConfig() as Partial<
      ILayerConfig & IPointLayerStyleOptions
    >;
    const { frag, vert, type } = this.getShaders(animateOption);

    this.layer.triangulation = PointFillTriangulation;

    this.layer
      .buildLayerModel({
        moduleName: type,
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        workerEnabled,
        workerOptions: {
          modelType: type,
          enablePicking,
          shape2d,
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

  /**
   * 根据 animateOption 的值返回对应的 shader 代码
   * @returns
   */
  public getShaders(
    animateOption: Partial<IAnimateOption>,
  ): { frag: string; vert: string; type: string } {
    if (animateOption.enable) {
      switch (animateOption.type) {
        case 'wave':
          return {
            frag: waveFillFrag,
            vert: pointFillVert,
            type: 'pointWave',
          };
        default:
          return {
            frag: waveFillFrag,
            vert: pointFillVert,
            type: 'pointWave',
          };
      }
    } else {
      return {
        frag: pointFillFrag,
        vert: pointFillVert,
        type: 'pointFill',
      };
    }
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    const shape2d = this.layer.getLayerConfig().shape2d as string[];

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
          return Array.isArray(size) ? [size[0]] : [size];
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
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }

  /**
   * 判断是否更新点图层的计量单位
   * @param unit
   */
  private updateUnit(unit: string) {
    const { version } = this.mapService;
    if (this.unit !== unit) {
      // l7size => meter
      if (
        this.unit !== 'meter' &&
        unit === 'meter' &&
        version !== Version.L7MAP &&
        version !== Version.GLOBEL
      ) {
        this.isMeter = true;
        this.calMeter2Coord();
        // meter => l7size
      } else if (this.unit === 'meter' && unit !== 'meter') {
        this.isMeter = false;
        this.meter2coord = 1;
      }
      this.unit = unit;
    }
  }
}
