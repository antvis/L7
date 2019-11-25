import { IModel, IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';

export default class ExtrudeModel extends BaseModel {
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
