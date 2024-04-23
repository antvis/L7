import type { IEncodeFeature, ILayer, ILayerPlugin, L7Container } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { decodePickingColor, encodePickingColor, lodashUtil, rgb2arr } from '@antv/l7-utils';
import { COMMON_ATTRIBUTE_LOCATION } from '../core/CommonStyleAttribute';
const { isNumber } = lodashUtil;

const PickingStage = {
  NONE: 0.0,
  ENCODE: 1.0,
  HIGHLIGHT: 2.0,
};

export default class PixelPickingPlugin implements ILayerPlugin {
  /**
   * Use map to keep order of insertion.
   * @see https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
   */
  private pickingUniformMap: Map<string, number[] | number>;

  private pickOption2Array() {
    const array: number[] = [];
    this.pickingUniformMap.forEach((value) => {
      if (isNumber(value)) {
        array.push(value);
      } else {
        array.push(...value);
      }
    });
    return array;
  }

  private updatePickOption(options: { [key: string]: number[] | number }, layer: ILayer) {
    Object.keys(options).forEach((key) => {
      this.pickingUniformMap.set(key, options[key]);
    });

    const u_PickingBuffer = layer.getLayerConfig().pickingBuffer || 0;
    // Tip: 当前地图是否在拖动
    const u_shaderPick = Number(layer.getShaderPickStat());
    this.pickingUniformMap.set('u_PickingBuffer', u_PickingBuffer);
    this.pickingUniformMap.set('u_shaderPick', u_shaderPick);

    const uniformBuffer = layer.getPickingUniformBuffer();
    uniformBuffer.subData({
      offset: 0,
      data: this.pickOption2Array(),
    });
  }
  public apply(layer: ILayer, { styleAttributeService }: L7Container) {
    this.pickingUniformMap = new Map<string, number[] | number>([
      ['u_HighlightColor', [1, 0, 0, 1]],
      ['u_SelectColor', [1, 0, 0, 1]],
      ['u_PickingColor', [0, 0, 0]],
      ['u_PickingStage', 0],
      ['u_CurrentSelectedId', [0, 0, 0]],
      ['u_PickingThreshold', 10],
      ['u_PickingBuffer', 0],
      ['u_shaderPick', 0],
      ['u_activeMix', 0],
    ]);

    // TODO: 由于 Shader 目前无法根据是否开启拾取进行内容修改，因此即使不开启也需要生成 a_PickingColor
    layer.hooks.init.tapPromise('PixelPickingPlugin', () => {
      const { enablePicking } = layer.getLayerConfig();
      styleAttributeService.registerStyleAttribute({
        name: 'pickingColor',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_PickingColor',
          shaderLocation: COMMON_ATTRIBUTE_LOCATION.PICKING_COLOR,
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
        this.updatePickOption(
          {
            u_PickingStage: PickingStage.ENCODE,
          },
          layer,
        );
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
        this.updatePickOption(
          {
            u_PickingStage: PickingStage.HIGHLIGHT,
          },
          layer,
        );
        layer.models.forEach((model) =>
          model.addUniforms({
            u_PickingStage: PickingStage.HIGHLIGHT,
          }),
        );
      }
    });

    layer.hooks.beforeHighlight.tap('PixelPickingPlugin', (pickedColor: number[]) => {
      const { highlightColor, activeMix = 0 } = layer.getLayerConfig();

      const highlightColorInArray =
        typeof highlightColor === 'string'
          ? rgb2arr(highlightColor)
          : highlightColor || [1, 0, 0, 1];

      layer.updateLayerConfig({
        pickedFeatureID: decodePickingColor(new Uint8Array(pickedColor)),
      });
      const option = {
        u_PickingStage: PickingStage.HIGHLIGHT,
        u_PickingColor: pickedColor,
        u_HighlightColor: highlightColorInArray.map((c) => c * 255),
        u_activeMix: activeMix,
      };
      this.updatePickOption(option, layer);
      layer.models.forEach((model) => model.addUniforms(option));
    });

    layer.hooks.beforeSelect.tap('PixelPickingPlugin', (pickedColor: number[]) => {
      const { selectColor, selectMix = 0 } = layer.getLayerConfig();
      const highlightColorInArray =
        typeof selectColor === 'string' ? rgb2arr(selectColor) : selectColor || [1, 0, 0, 1];
      layer.updateLayerConfig({
        pickedFeatureID: decodePickingColor(new Uint8Array(pickedColor)),
      });

      const option = {
        u_PickingStage: PickingStage.HIGHLIGHT,
        u_PickingColor: pickedColor,
        u_HighlightColor: highlightColorInArray.map((c) => c * 255),
        u_activeMix: selectMix,
        u_CurrentSelectedId: pickedColor,
        u_SelectColor: highlightColorInArray.map((c) => c * 255),
      };
      this.updatePickOption(option, layer);
      layer.models.forEach((model) => model.addUniforms(option));
    });
  }
}
