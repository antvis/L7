import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { GlobelPointFillTriangulation } from '../../core/triangulation';

import pointFillFrag from '../shaders/earth/fill_frag.glsl';
import pointFillVert from '../shaders/earth/fill_vert.glsl';

import { rgb2arr } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
export default class FillModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = 'rgba(0,0,0,0)',
      // offsets = [0, 0],
      blend,
      blur = 0,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    return {
      u_blur: blur,
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_opacity: opacity,
      u_stroke_opacity: strokeOpacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(stroke),
      // u_offsets: offsets,
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption = { enable: false } } =
      this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_animate: this.animateOption2Array(animateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = GlobelPointFillTriangulation;
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointEarthFill',
      vertexShader: pointFillVert,
      fragmentShader: pointFillFrag,
      triangulation: GlobelPointFillTriangulation,
      depth: { enable: true },

      blend: this.getBlend(),
    });
    return [model];
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
          const [x, y, z] = vertex;
          const n1 = vec3.fromValues(0, 0, 1);
          const n2 = vec3.fromValues(x, 0, z);

          const xzReg =
            x >= 0 ? vec3.angle(n1, n2) : Math.PI * 2 - vec3.angle(n1, n2);

          const yReg = Math.PI * 2 - Math.asin(y / 100);

          const m = mat4.create();
          mat4.rotateY(m, m, xzReg);
          mat4.rotateX(m, m, yReg);

          const v1 = vec3.fromValues(1, 1, 0);
          vec3.transformMat4(v1, v1, m);
          vec3.normalize(v1, v1);

          const v2 = vec3.fromValues(-1, 1, 0);
          vec3.transformMat4(v2, v2, m);
          vec3.normalize(v2, v2);

          const v3 = vec3.fromValues(-1, -1, 0);
          vec3.transformMat4(v3, v3, m);
          vec3.normalize(v3, v3);

          const v4 = vec3.fromValues(1, -1, 0);
          vec3.transformMat4(v4, v4, m);
          vec3.normalize(v4, v4);

          const extrude = [...v1, ...v2, ...v3, ...v4];
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
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
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
        update: (feature: IEncodeFeature) => {
          const { shape = 2 } = feature;
          const shape2d = this.layer.getLayerConfig().shape2d as string[];
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }
}
