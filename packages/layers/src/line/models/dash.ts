import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
export default class ArcModel extends BaseModel {
  public getUninforms() {
    return {};
  }

  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }

  protected registerBuiltinAttributes() {
    //
  }
}
