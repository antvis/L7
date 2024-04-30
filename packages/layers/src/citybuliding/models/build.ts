import type { IEncodeFeature, IModel } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { ICityBuildLayerStyleOptions } from '../../core/interface';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import buildFrag from '../shaders/build_frag.glsl';
import buildVert from '../shaders/build_vert.glsl';

export default class CityBuildModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      NORMAL: 10,
      UV: 11,
    });
  }

  private cityCenter: [number, number];
  private cityMinSize: number;
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      opacity = 1,
      baseColor = 'rgb(16,16,16)',
      brightColor = 'rgb(255,176,38)',
      windowColor = 'rgb(30,60,89)',
      time = 0,
      sweep = {
        enable: false,
        sweepRadius: 1,
        sweepColor: 'rgb(255, 255, 255)',
        sweepSpeed: 0.4,
        sweepCenter: this.cityCenter,
      },
    } = this.layer.getLayerConfig() as ICityBuildLayerStyleOptions;

    const commonOptions = {
      u_baseColor: rgb2arr(baseColor),
      u_brightColor: rgb2arr(brightColor),
      u_windowColor: rgb2arr(windowColor),
      u_circleSweepColor: [...rgb2arr(sweep.sweepColor).slice(0, 3), 1.0],
      u_cityCenter: sweep.sweepCenter || this.cityCenter,
      u_circleSweep: sweep.enable ? 1.0 : 0.0,
      u_cityMinSize: this.cityMinSize * sweep.sweepRadius,
      u_circleSweepSpeed: sweep.sweepSpeed,
      u_opacity: opacity,
      u_near: 0,
      u_far: 1,
      u_time: this.layer.getLayerAnimateTime() || time,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public calCityGeo() {
    // @ts-ignore
    const [minLng, minLat, maxLng, maxLat] = this.layer.getSource().extent;

    const w = maxLng - minLng;
    const h = maxLat - minLat;
    this.cityCenter = [(maxLng + minLng) / 2, (maxLat + minLat) / 2];
    this.cityMinSize = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 4;
  }

  public async initModels(): Promise<IModel[]> {
    this.calCityGeo();
    this.initUniformsBuffer();
    this.startModelAnimate();

    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'cityBuilding',
      vertexShader: buildVert,
      fragmentShader: buildFrag,
      triangulation: PolygonExtrudeTriangulation,
      depth: { enable: true },
      defines: this.getDefines(),
      inject: this.getInject(),
      cull: {
        enable: true,
        face: gl.BACK,
      },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
