import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  ILogService,
  lazyInject,
  TYPES,
} from '@l7/core';
import { inject, injectable } from 'inversify';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
@injectable()
export default class RegisterStyleAttributePlugin implements ILayerPlugin {
  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  public apply(layer: ILayer) {
    layer.hooks.init.tap('RegisterStyleAttributePlugin', () => {
      this.registerBuiltinAttributes(layer);
    });
  }

  private registerBuiltinAttributes(layer: ILayer) {
    layer.styleAttributeService.registerStyleAttribute({
      name: 'position',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Position',
        buffer: {
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return vertex.length === 2
            ? [vertex[0], vertex[1], 0]
            : [vertex[0], vertex[1], vertex[2]];
        },
      },
    });

    layer.styleAttributeService.registerStyleAttribute({
      name: 'color',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Color',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number) => {
          const { color = [1.0, 1.0, 1.0, 1.0] } = feature;
          return color;
        },
      },
    });
  }
}
