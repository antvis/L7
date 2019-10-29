import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IRendererService,
  lazyInject,
  TYPES,
} from '@l7/core';
import { inject, injectable } from 'inversify';
import { rgb2arr } from '../utils/color';

function encodePickingColor(featureIdx: number): [number, number, number] {
  return [
    (featureIdx + 1) & 255,
    ((featureIdx + 1) >> 8) & 255,
    (((featureIdx + 1) >> 8) >> 8) & 255,
  ];
}

const PickingStage = {
  NONE: 0.0,
  ENCODE: 1.0,
  HIGHLIGHT: 2.0,
};

@injectable()
export default class PixelPickingPlugin implements ILayerPlugin {
  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  public apply(layer: ILayer) {
    // TODO: 由于 Shader 目前无法根据是否开启拾取进行内容修改，因此即使不开启也需要生成 a_PickingColor
    layer.hooks.init.tap('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getStyleOptions();
      layer.styleAttributeService.registerStyleAttribute({
        name: 'pickingColor',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_PickingColor',
          buffer: {
            data: [],
            type: gl.FLOAT,
          },
          size: 3,
          // TODO: 固定 feature range 范围内的 pickingColor 都是固定的，可以生成 cache
          update: (feature: IEncodeFeature, featureIdx: number) =>
            // 只有开启拾取才需要 encode
            enablePicking ? encodePickingColor(featureIdx) : [0, 0, 0],
        },
      });
    });
    // 必须要与 PixelPickingPass 结合使用，因此必须开启 multiPassRenderer
    // if (layer.multiPassRenderer) {
    layer.hooks.beforePickingEncode.tap('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getStyleOptions();
      if (enablePicking) {
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.ENCODE,
          }),
        );
      }
    });

    layer.hooks.afterPickingEncode.tap('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getStyleOptions();
      if (enablePicking) {
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.NONE,
            u_PickingColor: [0, 0, 0],
            u_HighlightColor: [0, 0, 0, 0],
          }),
        );
      }
    });

    layer.hooks.beforeHighlight.tap(
      'PixelPickingPlugin',
      (pickedColor: number[]) => {
        const { highlightColor } = layer.getStyleOptions();
        const highlightColorInArray =
          typeof highlightColor === 'string'
            ? rgb2arr(highlightColor)
            : highlightColor || [1, 0, 0, 1];
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.HIGHLIGHT,
            u_PickingColor: pickedColor,
            u_HighlightColor: highlightColorInArray.map((c) => c * 255),
          }),
        );
      },
    );
    // }
  }
}
