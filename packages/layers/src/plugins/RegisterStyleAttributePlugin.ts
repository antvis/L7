import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IStyleAttributeService,
} from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { isTileGroup } from '../tile/utils';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
@injectable()
export default class RegisterStyleAttributePlugin implements ILayerPlugin {
  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tapPromise('RegisterStyleAttributePlugin', () => {
      // 过滤 tileGroup layer （瓦片图层不需要注册）
      if (isTileGroup(layer)) {
        return;
      }

      this.registerBuiltinAttributes(styleAttributeService, layer);
    });
  }

  private registerBuiltinAttributes(
    styleAttributeService: IStyleAttributeService,
    layer: ILayer,
  ) {
    // MaskLayer 只需要注册 a_Position
    if (layer.type === 'MaskLayer') {
      this.registerPositionAttribute(styleAttributeService);
      return;
    }
    // Tip: normal render layer
    this.registerPositionAttribute(styleAttributeService);
    // this.registerFilterAttribute(styleAttributeService);//数据层数据过滤
    this.registerColorAttribute(styleAttributeService);
    this.registerVertexIdAttribute(styleAttributeService);
  }

  private registerPositionAttribute(
    styleAttributeService: IStyleAttributeService,
  ) {
    styleAttributeService.registerStyleAttribute({
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
  }

  private registerFilterAttribute(
    styleAttributeService: IStyleAttributeService,
  ) {
    styleAttributeService.registerStyleAttribute({
      name: 'filter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'filter',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { filter } = feature;
          return filter ? [1] : [0];
        },
      },
    });
  }

  private registerColorAttribute(
    styleAttributeService: IStyleAttributeService,
  ) {
    styleAttributeService.registerStyleAttribute({
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
        update: (feature: IEncodeFeature) => {
          const { color } = feature;
          return !color || !color.length ? [1, 1, 1, 1] : color;
        },
      },
    });
  }

  private registerVertexIdAttribute(
    styleAttributeService: IStyleAttributeService,
  ) {
    styleAttributeService.registerStyleAttribute({
      // 统一注册每个顶点的唯一编号（目前用于样式的数据映射计算使用）
      name: 'vertexId',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_vertexId',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature, featureIdx: number) => {
          return [featureIdx];
        },
      },
    });
  }
}
