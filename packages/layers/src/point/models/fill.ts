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
import { PointFillTriangulation } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
import { IPointLayerStyleOptions, SizeUnitType } from '../../core/interface';
// animate pointLayer shader - support animate
import waveFillFrag from '../shaders/animate/wave_frag.glsl';
// static pointLayer shader - not support animate
import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';

export default class FillModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      strokeOpacity = 1,
      strokeWidth = 0,
      blend,
      blur = 0,
      raisingHeight = 0,
      heightfixed = false,
      unit = 'pixel',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    const commonIniform = {
      u_blur_height_fixed: [blur, Number(raisingHeight), Number(heightfixed)],
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_stroke_opacity: strokeOpacity,
      u_stroke_width: strokeWidth,
      u_size_unit: SizeUnitType[unit] as SizeUnitType,
      ...this.getStyleAttribute(),
    };

    const attributes = this.getStyleAttribute();
    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...attributes.u_stroke,
          ...attributes.u_offsets,
          attributes.u_opacity,
          attributes.u_rotation,
        ]).buffer,
      ),
    });

    this.uniformBuffers[1].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...commonIniform.u_blur_height_fixed,
          commonIniform.u_stroke_width,
          commonIniform.u_additive,
          commonIniform.u_stroke_opacity,
          commonIniform.u_size_unit,
          0,
        ]).buffer,
      ),
    });
    return commonIniform;
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption = { enable: false } } =
      this.layer.getLayerConfig() as ILayerConfig;
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

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { animateOption = { enable: false } } =
      this.layer.getLayerConfig() as Partial<
        ILayerConfig & IPointLayerStyleOptions
      >;
    const { frag, vert, type } = this.getShaders(animateOption);
    this.layer.triangulation = PointFillTriangulation;
    const attributeUniformBuffer = this.rendererService.createBuffer({
      data: new Float32Array(4 + 2 + 1 + 1),
      isUBO: true,
    });

    const commonUniforms = this.rendererService.createBuffer({
      data: new Float32Array(8),
      isUBO: true,
    });

    this.uniformBuffers.push(attributeUniformBuffer, commonUniforms);
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      inject: this.getInject(),
      triangulation: PointFillTriangulation,
      depth: { enable: false },
    });
    return [model];
  }

  /**
   * 根据 animateOption 的值返回对应的 shader 代码
   * @returns
   */
  public getShaders(animateOption: Partial<IAnimateOption>): {
    frag: string;
    vert: string;
    type: string;
  } {
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

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    // 注册 Style 参与数据映射的内置属性
    const shape2d = this.layer.getLayerConfig().shape2d as string[];

    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        shaderLocation: ShaderLocation.EXTRUDE,
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
        shaderLocation: ShaderLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size];
        },
      },
    });

    // point layer shape;
    this.styleAttributeService.registerStyleAttribute({
      name: 'shape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Shape',
        shaderLocation: ShaderLocation.SHAPE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { shape = 2 } = feature;
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }
}
