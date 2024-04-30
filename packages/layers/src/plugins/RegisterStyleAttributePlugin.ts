import type {
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IStyleAttributeService,
  L7Container,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { COMMON_ATTRIBUTE_LOCATION } from '../core/CommonStyleAttribute';
import { isTileGroup } from '../tile/utils/utils';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
export default class RegisterStyleAttributePlugin implements ILayerPlugin {
  public apply(layer: ILayer, { styleAttributeService }: L7Container) {
    layer.hooks.init.tapPromise('RegisterStyleAttributePlugin', () => {
      // 过滤 tileGroup layer （瓦片图层不需要注册）
      if (isTileGroup(layer)) {
        return;
      }

      this.registerBuiltinAttributes(styleAttributeService, layer);
    });
  }

  private registerBuiltinAttributes(styleAttributeService: IStyleAttributeService, layer: ILayer) {
    // MaskLayer 只需要注册 a_Position
    if (layer.type === 'MaskLayer') {
      this.registerPositionAttribute(styleAttributeService);
      return;
    }
    // Tip: normal render layer
    this.registerPositionAttribute(styleAttributeService);
    // this.registerFilterAttribute(styleAttributeService);//数据层数据过滤
    this.registerColorAttribute(styleAttributeService);
  }

  private registerPositionAttribute(styleAttributeService: IStyleAttributeService) {
    styleAttributeService.registerStyleAttribute({
      name: 'position',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Position',
        shaderLocation: COMMON_ATTRIBUTE_LOCATION.POSITION,
        buffer: {
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return vertex.length === 2
            ? [vertex[0], vertex[1], 0]
            : [vertex[0], vertex[1], vertex[2]];
        },
      },
    });
  }

  private registerColorAttribute(styleAttributeService: IStyleAttributeService) {
    styleAttributeService.registerStyleAttribute({
      name: 'color',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Color',
        shaderLocation: COMMON_ATTRIBUTE_LOCATION.COLOR,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature) => {
          const { color } = feature;
          return !color || !color.length ? [1, 1, 1, 1] : color;
        },
      },
    });
  }
}
