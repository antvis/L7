import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IRendererService,
  IStyleAttributeService,
} from '@antv/l7-core';
import {
  decodePickingColor,
  encodePickingColor,
  rgb2arr,
} from '@antv/l7-utils';
import { injectable } from 'inversify';
import 'reflect-metadata';

const PickingStage = {
  NONE: 0.0,
  ENCODE: 1.0,
  HIGHLIGHT: 2.0,
};

@injectable()
export default class PixelPickingPlugin implements ILayerPlugin {
  public apply(
    layer: ILayer,
    {
      rendererService,
      styleAttributeService,
    }: {
      rendererService: IRendererService;
      styleAttributeService: IStyleAttributeService;
    },
  ) {
    if (!rendererService.uniformBuffers[1]) {
      // Create a Uniform Buffer Object(UBO).
      const uniformBuffer = rendererService.createBuffer({
        // vec4 u_HighlightColor;
        // vec4 u_SelectColor;
        // vec3 u_PickingColor;
        // float u_PickingStage;
        // vec3 u_CurrentSelectedId;
        // float u_PickingThreshold;
        // float u_PickingBuffer;
        // float u_shaderPick;
        // float u_EnableSelect;
        // float u_activeMix;
        data: new Float32Array([
          ...[1, 0, 0, 1],
          ...[1, 0, 0, 1],
          ...[0, 0, 0],
          0,
          ...[0, 0, 0],
          0,
          0,
          0,
          0,
          0,
        ]),
        isUBO: true,
      });
      rendererService.uniformBuffers[1] = uniformBuffer;
    }
    // u_PickingBuffer: layer.getLayerConfig().pickingBuffer || 0,
    // // Tip: 当前地图是否在拖动
    // u_shaderPick: Number(layer.getShaderPickStat()),

    // TODO: 由于 Shader 目前无法根据是否开启拾取进行内容修改，因此即使不开启也需要生成 a_PickingColor
    layer.hooks.init.tapPromise('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getLayerConfig();
      styleAttributeService.registerStyleAttribute({
        name: 'pickingColor',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_PickingColor',
          shaderLocation: 2,
          buffer: {
            data: [],
            type: gl.FLOAT,
          },
          size: 3,
          // TODO: 固定 feature range 范围内的 pickingColor 都是固定的，可以生成 cache
          update: (feature: IEncodeFeature) => {
            // 只有开启拾取才需要 encode
            const { id } = feature;
            return enablePicking ? encodePickingColor(id as number) : [0, 0, 0];
          },
        },
      });
    });
    // 必须要与 PixelPickingPass 结合使用，因此必须开启 multiPassRenderer
    layer.hooks.beforePickingEncode.tap('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getLayerConfig();
      if (enablePicking && layer.isVisible()) {
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.ENCODE,
          }),
        );
      }
    });

    layer.hooks.afterPickingEncode.tap('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getLayerConfig();
      // 区分选中高亮 和滑过高亮
      if (enablePicking && layer.isVisible()) {
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.HIGHLIGHT,
          }),
        );
      }
    });

    layer.hooks.beforeHighlight.tap(
      'PixelPickingPlugin',
      (pickedColor: number[]) => {
        const { highlightColor, activeMix = 0 } = layer.getLayerConfig();

        const highlightColorInArray =
          typeof highlightColor === 'string'
            ? rgb2arr(highlightColor)
            : highlightColor || [1, 0, 0, 1];

        layer.updateLayerConfig({
          pickedFeatureID: decodePickingColor(new Uint8Array(pickedColor)),
        });
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.HIGHLIGHT,
            u_PickingColor: pickedColor,
            u_HighlightColor: highlightColorInArray.map((c) => c * 255),
            u_activeMix: activeMix,
          }),
        );
      },
    );

    layer.hooks.beforeSelect.tap(
      'PixelPickingPlugin',
      (pickedColor: number[]) => {
        const { selectColor, selectMix = 0 } = layer.getLayerConfig();
        const highlightColorInArray =
          typeof selectColor === 'string'
            ? rgb2arr(selectColor)
            : selectColor || [1, 0, 0, 1];
        layer.updateLayerConfig({
          pickedFeatureID: decodePickingColor(new Uint8Array(pickedColor)),
        });
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.HIGHLIGHT,
            u_PickingColor: pickedColor,
            u_HighlightColor: highlightColorInArray.map((c) => c * 255),
            u_activeMix: selectMix,
            u_CurrentSelectedId: pickedColor,
            u_SelectColor: highlightColorInArray.map((c) => c * 255),
            u_EnableSelect: 1,
          }),
        );
      },
    );
  }
}
