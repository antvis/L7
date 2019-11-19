import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { PointExtrudeTriangulation } from '../core/triangulation';
import pointExtrudeFrag from './shaders/extrude_frag.glsl';
import pointExtrudeVert from './shaders/extrude_vert.glsl';

export default class ExtrudeModel implements ILayerModel {
  private layer: ILayer;
  constructor(layer: ILayer) {
    this.layer = layer;
    this.registerBuiltinAttributes();
  }
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
