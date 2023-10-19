import { AttributeType, gl, IEncodeFeature, IModel } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ICityBuildLayerStyleOptions } from '../../core/interface';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import buildFrag from '../shaders/build_frag.glsl';
import buildVert from '../shaders/build_vert.glsl';
export default class CityBuildModel extends BaseModel {
  private cityCenter: [number, number];
  private cityMinSize: number;

  public getUninforms() {
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

    const u_cityCenter = sweep.sweepCenter || this.cityCenter;
    const u_cityMinSize = this.cityMinSize * sweep.sweepRadius;
    const u_circleSweep = sweep.enable ? 1.0 : 0.0;
    const u_circleSweepColor = rgb2arr(sweep.sweepColor).slice(0, 3);
    const u_circleSweepSpeed = sweep.sweepSpeed;
    const u_opacity = opacity;
    const u_baseColor = rgb2arr(baseColor);
    const u_brightColor = rgb2arr(brightColor);
    const u_windowColor = rgb2arr(windowColor);
    const u_time = this.layer.getLayerAnimateTime() || time;

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...u_baseColor,
          ...u_brightColor,
          ...u_windowColor,
          ...u_circleSweepColor,
          u_cityMinSize,
          ...u_cityCenter,
          u_circleSweep,
          u_circleSweepSpeed,
          u_opacity,
          u_time,
        ]).buffer,
      ),
    });

    return {
      u_baseColor,
      u_brightColor,
      u_windowColor,
      u_circleSweepColor,
      u_cityCenter,
      u_cityMinSize,
      u_circleSweep,
      u_circleSweepSpeed,
      u_opacity,
      u_time,
    };
  }

  public calCityGeo() {
    // @ts-ignore
    const [minLng, minLat, maxLng, maxLat] = this.layer.getSource().extent;
    if (this.mapService.version === 'GAODE2.x') {
      // @ts-ignore
      this.cityCenter = this.mapService.lngLatToCoord([
        (maxLng + minLng) / 2,
        (maxLat + minLat) / 2,
      ]);
      // @ts-ignore
      const l1 = this.mapService.lngLatToCoord([maxLng, maxLat]);
      // @ts-ignore
      const l2 = this.mapService.lngLatToCoord([minLng, minLat]);
      this.cityMinSize =
        Math.sqrt(Math.pow(l1[0] - l2[0], 2) + Math.pow(l1[1] - l2[1], 2)) / 4;
    } else {
      const w = maxLng - minLng;
      const h = maxLat - minLat;
      this.cityCenter = [(maxLng + minLng) / 2, (maxLat + minLat) / 2];
      this.cityMinSize = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 4;
    }
  }

  public async initModels(): Promise<IModel[]> {
    this.calCityGeo();

    this.startModelAnimate();

    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 * 3 + 3 + 2 + 1 * 5),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'cityBuilding',
      vertexShader: buildVert,
      fragmentShader: buildFrag,
      triangulation: PolygonExtrudeTriangulation,
      depth: { enable: true },
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
        shaderLocation: 7,
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
        shaderLocation: 8,
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
        shaderLocation: 9,
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
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
