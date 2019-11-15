import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  ILogService,
  IStyleAttributeService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { rgb2arr } from '../utils/color';
import pointFillFrag from './shaders/fill_frag.glsl';
import pointFillVert from './shaders/fill_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
}
export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public name: string = 'PointLayer';

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }
}
