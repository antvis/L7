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
import { PointExtrudeTriangulation } from '../core/triangulation';
import pointExtrudeFrag from '../shaders/extrude_frag.glsl';
import pointExtrudeVert from '../shaders/extrude_vert.glsl';

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
