import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
  IModelUniform,
} from '@l7/core';

import BaseModel from '../../core/baseModel';
export default class DashModel extends BaseModel {
  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }
  protected registerBuiltinAttributes() {
    throw new Error('Method not implemented.');
  }
}
