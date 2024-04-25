import type {
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PointFillTriangulation } from '../../core/triangulation';

import pointFillFrag from '../shaders/fill/fill_frag.glsl';
import pointFillVert from '../shaders/fill/fill_vert.glsl';

import type { IPointLayerStyleOptions } from '../../core/interface';
import { SizeUnitType } from '../../core/interface';

export default class FillModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      SHAPE: 10,
      EXTRUDE: 11,
    });
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      strokeOpacity = 1,
      strokeWidth = 0,
      blend,
      blur = 0,
      raisingHeight = 0,
      heightfixed = false,
      unit = 'pixel',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    let u_time = this.getAnimateUniforms().u_time;
    if (isNaN(u_time as number)) {
      u_time = -1.0;
    }
    const commonOptions = {
      u_blur_height_fixed: [blur, Number(raisingHeight), Number(heightfixed)],
      u_stroke_width: strokeWidth,
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_stroke_opacity: strokeOpacity,
      u_size_unit: SizeUnitType[unit] as SizeUnitType,
      u_time,
      u_animate: this.getAnimateUniforms().u_animate,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);

    return commonBufferInfo;
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption = { enable: false } } = this.layer.getLayerConfig() as ILayerConfig;
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
    const { frag, vert, type } = this.getShaders();
    this.layer.triangulation = PointFillTriangulation;
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      defines: this.getDefines(),
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
  public getShaders(): {
    frag: string;
    vert: string;
    type: string;
  } {
    return {
      frag: pointFillFrag,
      vert: pointFillVert,
      type: 'pointFill',
    };
  }

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    // 注册 Style 参与数据映射的内置属性
    const shape2d = this.layer.getLayerConfig().shape2d as string[];

    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        shaderLocation: this.attributeLocation.EXTRUDE,
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
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1], extrude[extrudeIndex + 2]];
        },
      },
    });

    // point layer size;
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
        shaderLocation: this.attributeLocation.SHAPE,
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
