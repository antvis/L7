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
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';

import pointFillFrag from '../shaders/radar/radar_frag.glsl';
import pointFillVert from '../shaders/radar/radar_vert.glsl';

import { Version } from '@antv/l7-maps';

export default class RadarModel extends BaseModel {
  public meter2coord: number = 1;
  private isMeter: boolean = false;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      blend,
      speed = 1,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    return {
      u_isMeter: Number(this.isMeter),
      u_speed: speed,
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const {
      animateOption = { enable: false },
    } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_animate: this.animateOption2Array(animateOption),
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

  public async initModels():Promise<IModel[]>  {
    const {
      unit = 'l7size',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const { version } = this.mapService;
    if (
      unit === 'meter' &&
      version !== Version.DEFUALT &&
      version !== Version.GLOBEL
    ) {
      this.isMeter = true;
      this.calMeter2Coord();
    }

    return await this.buildModels();
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
    if (!this.meter2coord) {
      // Tip: 兼容单个数据导致的 m1、m2 为 NaN
      this.meter2coord = 7.70681090738883;
    }
  }

 public async buildModels():Promise<IModel[]>  {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

       const model = await this.layer
      .buildLayerModel({
        moduleName: 'pointRadar',
        vertexShader: pointFillVert,
        fragmentShader: pointFillFrag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      })
      return [model]
       
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
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
        ) => {
          const { size = 5 } = feature;
          return Array.isArray(size)
            ? [size[0] * this.meter2coord]
            : [(size as number) * this.meter2coord];
        },
      },
    });
  }
}
