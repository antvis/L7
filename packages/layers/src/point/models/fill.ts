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

import pointFillFrag from '../shaders/fill/fill_frag.glsl';
import pointFillVert from '../shaders/fill/fill_vert.glsl';

export default class FillModel extends BaseModel {
  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption: { [key: string]: any } } {
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
    if(isNaN(u_time as number)){
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
    this.initUniformsBuffer();
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
      name: 'sizeAndShape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_SizeAndShape',
        shaderLocation: ShaderLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          const { shape = 2 } = feature;
          const shapeIndex = shape2d.indexOf(shape as string);
          const a_Size =  Array.isArray(size) ? size[0] : size;
          return [a_Size,shapeIndex]
        },
      },
    });
  }
}
