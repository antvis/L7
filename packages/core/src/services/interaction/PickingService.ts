import { decodePickingColor, encodePickingColor } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import {
  IMapService,
  IRendererService,
  IShaderModuleService,
} from '../../index';
import { TYPES } from '../../types';
import {
  IInteractionService,
  IInteractionTarget,
  InteractionEvent,
} from '../interaction/IInteractionService';
import { ILayer, ILayerService } from '../layer/ILayerService';
import { ILngLat } from '../map/IMapService';
import { gl } from '../renderer/gl';
import { IFramebuffer } from '../renderer/IFramebuffer';
import { IPickingService } from './IPickingService';

const PICKSCALE = 1.0;
@injectable()
export default class PickingService implements IPickingService {
  @inject(TYPES.IRendererService)
  private rendererService: IRendererService;

  @inject(TYPES.IInteractionService)
  private interactionService: IInteractionService;

  @inject(TYPES.ILayerService)
  private layerService: ILayerService;
  private pickingFBO: IFramebuffer;

  private width: number = 0;

  private height: number = 0;

  private alreadyInPicking: boolean = false;

  public init() {
    const {
      createTexture2D,
      createFramebuffer,
      getViewportSize,
    } = this.rendererService;
    const { width, height } = getViewportSize();
    // 创建 picking framebuffer，后续实时 resize
    this.pickingFBO = createFramebuffer({
      color: createTexture2D({
        width,
        height,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });

    // 监听 hover 事件
    this.interactionService.on(
      InteractionEvent.Hover,
      this.pickingAllLayer.bind(this),
    );
  }
  private async pickingAllLayer(target: IInteractionTarget) {
    if (this.alreadyInPicking || this.layerService.alreadyInRendering) {
      return;
    }
    this.alreadyInPicking = true;
    await this.pickingLayers(target);
    this.layerService.renderLayers();
    this.alreadyInPicking = false;
  }
  private async pickingLayers(target: IInteractionTarget) {
    const { getViewportSize, useFramebuffer, clear } = this.rendererService;
    const { width, height } = getViewportSize();

    if (this.width !== width || this.height !== height) {
      this.pickingFBO.resize({
        width: Math.round(width / PICKSCALE),
        height: Math.round(height / PICKSCALE),
      });
      this.width = width;
      this.height = height;
    }

    useFramebuffer(this.pickingFBO, () => {
      const layers = this.layerService.getLayers();
      layers
        .filter((layer) => layer.needPick())
        .reverse()
        .forEach((layer) => {
          clear({
            framebuffer: this.pickingFBO,
            color: [0, 0, 0, 0],
            stencil: 0,
            depth: 1,
          });

          layer.hooks.beforePickingEncode.call();
          layer.renderModels();
          layer.hooks.afterPickingEncode.call();
          this.pickFromPickingFBO(layer, target);
        });
    });
  }
  private pickFromPickingFBO = (
    layer: ILayer,
    { x, y, lngLat, type }: IInteractionTarget,
  ) => {
    const { getViewportSize, readPixels } = this.rendererService;
    const { width, height } = getViewportSize();
    const { enableHighlight, enableSelect } = layer.getLayerConfig();

    const xInDevicePixel = x * window.devicePixelRatio;
    const yInDevicePixel = (height - (y + 1)) * window.devicePixelRatio;
    if (
      xInDevicePixel > width ||
      xInDevicePixel < 0 ||
      yInDevicePixel > height ||
      yInDevicePixel < 0
    ) {
      return;
    }
    let pickedColors: Uint8Array | undefined;
    pickedColors = readPixels({
      x: Math.floor(xInDevicePixel / PICKSCALE),
      // 视口坐标系原点在左上，而 WebGL 在左下，需要翻转 Y 轴
      y: Math.floor(yInDevicePixel / PICKSCALE),
      width: 1,
      height: 1,
      data: new Uint8Array(1 * 1 * 4),
      framebuffer: this.pickingFBO,
    });
    if (
      pickedColors[0] !== 0 ||
      pickedColors[1] !== 0 ||
      pickedColors[2] !== 0
    ) {
      const pickedFeatureIdx = decodePickingColor(pickedColors);
      const rawFeature = layer.getSource().getFeatureById(pickedFeatureIdx);
      const target = {
        x,
        y,
        type,
        lngLat,
        featureId: pickedFeatureIdx,
        feature: rawFeature,
      };
      if (!rawFeature) {
        // this.logger.error(
        //   '未找到颜色编码解码后的原始 feature，请检查 fragment shader 中末尾是否添加了 `gl_FragColor = filterColor(gl_FragColor);`',
        // );
      } else {
        // trigger onHover/Click callback on layer
        layer.setCurrentPickId(pickedFeatureIdx);
        this.triggerHoverOnLayer(layer, target);
      }
    } else {
      const target = {
        x,
        y,
        lngLat,
        type: layer.getCurrentPickId() === null ? 'un' + type : 'mouseout',
        featureId: null,
        feature: null,
      };
      this.triggerHoverOnLayer(layer, {
        ...target,
        type: 'unpick',
      });
      this.triggerHoverOnLayer(layer, target);
      layer.setCurrentPickId(null);
    }

    if (enableHighlight) {
      this.highlightPickedFeature(layer, pickedColors);
    }
    if (
      enableSelect &&
      type === 'click' &&
      pickedColors?.toString() !== [0, 0, 0, 0].toString()
    ) {
      this.selectFeature(layer, pickedColors);
    }
  };
  private triggerHoverOnLayer(
    layer: ILayer,
    target: {
      x: number;
      y: number;
      type: string;
      lngLat: ILngLat;
      feature: unknown;
      featureId: number | null;
    },
  ) {
    layer.emit(target.type, target);
  }

  /**
   * highlight 如果直接修改选中 feature 的 buffer，存在两个问题：
   * 1. 鼠标移走时无法恢复
   * 2. 无法实现高亮颜色与原始原色的 alpha 混合
   * 因此高亮还是放在 shader 中做比较好
   * @example
   * this.layer.color('name', ['#000000'], {
   *  featureRange: {
   *    startIndex: pickedFeatureIdx,
   *    endIndex: pickedFeatureIdx + 1,
   *  },
   * });
   */
  private highlightPickedFeature(
    layer: ILayer,
    pickedColors: Uint8Array | undefined,
  ) {
    const [r, g, b] = pickedColors;
    layer.hooks.beforeHighlight.call([r, g, b]);
  }

  private selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
  }
}
