import { isNil } from 'lodash';
import {
  IAttributeScale,
  IStyleAttribute,
  StyleScaleType,
} from '../layer/IStyleAttributeService';
import { IAttribute } from '../renderer/IAttribute';
import {
  AttributeType,
  IEncodeFeature,
  IFeatureRange,
  IStyleAttributeInitializationOptions,
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

  public mapping(){
    // console.log(this.scale?.defaultValues);
    
    return this.scale?.defaultValues;
  }

  public resetDescriptor() {
    if (this.descriptor) {
      this.descriptor.buffer.data = [];
    }
  }
}
