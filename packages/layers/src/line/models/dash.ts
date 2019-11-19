import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
} from '@l7/core';

import BaseModel from '../../core/baseModel';
export default class ArcModel extends BaseModel {
  public getUninforms() {
    throw new Error('Method not implemented.');
  }

  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }
  private registerBuiltinAttributes() {
    throw new Error('Method not implemented.');
  }
}
