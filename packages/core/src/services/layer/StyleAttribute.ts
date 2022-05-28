import { isNil } from 'lodash';
import {
  IAttributeScale,
  IScaleOption,
  IStyleAttribute,
  StyleScaleType,
} from '../layer/IStyleAttributeService';
import { IAttribute } from '../renderer/IAttribute';
import {
  AttributeType,
  IEncodeFeature,
  IFeatureRange,
  IStyleAttributeInitializationOptions,
  IStyleScale,
  IVertexAttributeDescriptor,
} from './IStyleAttributeService';

export default class StyleAttribute implements IStyleAttribute {
  public name: string;
  public type: AttributeType;
  public scale?: {
    type: StyleScaleType.CONSTANT;
    names: string[];
    field: string | string[];
    values: unknown[];
    defaultValues: unknown[];
    callback?: (...args: any[]) => [];
    scalers?: IAttributeScale[];
  };
  public descriptor: IVertexAttributeDescriptor;
  public featureBufferLayout: Array<{
    feature: IEncodeFeature;
    featureIdx: number;
    bufferOffset: number;
    length: number;
  }> = [];

  public needRescale: boolean = false;
  public needRemapping: boolean = false;
  public needRegenerateVertices: boolean = false;
  public featureRange: IFeatureRange = {
    startIndex: 0,
    endIndex: Infinity,
  };
  public vertexAttribute: IAttribute;

  constructor(options: Partial<IStyleAttributeInitializationOptions>) {
    this.setProps(options);
  }

  public setProps(options: Partial<IStyleAttributeInitializationOptions>) {
    Object.assign(this, options);
  }

  public mapping(params: unknown[]): unknown[] {
    /**
     * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
     */
    if (this.scale?.callback) {
      // 使用用户返回的值处理
      const ret = this.scale?.callback(...params);
      if (!isNil(ret)) {
        return [ret];
      }
    }

    // 没有 callback 或者用户 callback 返回值为空，则使用默认的逻辑处理
    return this.defaultCallback(params);
  }

  public resetDescriptor() {
    if (this.descriptor) {
      this.descriptor.buffer.data = [];
    }
  }

  private defaultCallback = (params: unknown[]): unknown[] => {
    // 没有 params 的情况，是指没有指定 fields，直接返回配置的 values 常量
    if (params.length === 0) {
      return this.scale?.defaultValues || [];
    }
    return params.map((param, idx) => {
      const scaleFunc = this.scale?.scalers![idx].func;
      // @ts-ignore // TODO 支持双变量映射
      const value = scaleFunc(param);
      return value;
    });
  };
}
