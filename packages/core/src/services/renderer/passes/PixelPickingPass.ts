import { decodePickingColor, DOM, encodePickingColor } from '@antv/l7-utils';
import { injectable } from 'inversify';
import 'reflect-metadata';
import {
  IInteractionTarget,
  InteractionEvent,
} from '../../interaction/IInteractionService';
import { ILayer } from '../../layer/ILayerService';
import { ILngLat } from '../../map/IMapService';
import { gl } from '../gl';
import { IFramebuffer } from '../IFramebuffer';
import { PassType } from '../IMultiPassRenderer';
import BaseNormalPass from './BaseNormalPass';

/**
 * color-based PixelPickingPass
 * @see https://github.com/antvis/L7/blob/next/dev-docs/PixelPickingEngine.md
 */
@injectable()
export default class PixelPickingPass<
  InitializationOptions = {},
> extends BaseNormalPass<InitializationOptions> {
  /**
   * picking framebuffer，供 attributes 颜色编码后输出
   */
  private pickingFBO: IFramebuffer;

  /**
   * 保存 layer 引用
   */
  private layer: ILayer;

  private width: number = 0;

  private height: number = 0;

  /**
   * 简单的 throttle，防止连续触发 hover 时导致频繁渲染到 picking framebuffer
   */
  private alreadyInRendering: boolean = false;

  public getType() {
    return PassType.Normal;
  }

  public getName() {
    return 'pixelPicking';
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {
    super.init(layer, config);
    this.layer = layer;
    const { createTexture2D, createFramebuffer, getViewportSize } =
      this.rendererService;
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
    this.interactionService.on(InteractionEvent.Hover, this.pickFromPickingFBO);
    this.interactionService.on(
      InteractionEvent.Select,
      this.selectFeatureHandle.bind(this),
    );
    this.interactionService.on(
      InteractionEvent.Active,
      this.highlightFeatureHandle.bind(this),
    );
  }

  public render(layer: ILayer) {
    if (this.alreadyInRendering) {
      return;
    }

    const { getViewportSize, useFramebuffer, clear } = this.rendererService;
    const { width, height } = getViewportSize();

    // throttled
    this.alreadyInRendering = true;

    // resize first, fbo can't be resized in use
    if (this.width !== width || this.height !== height) {
      this.pickingFBO.resize({ width, height });
      this.width = width;
      this.height = height;
    }
    useFramebuffer(this.pickingFBO, () => {
      clear({
        framebuffer: this.pickingFBO,
        color: [0, 0, 0, 0],
        stencil: 0,
        depth: 1,
      });

      /**
       * picking pass 不需要 multipass，原因如下：
       * 1. 已经 clear，无需 ClearPass
       * 2. 只需要 RenderPass
       * 3. 后处理 pass 需要跳过
       */
      const originRenderFlag = this.layer.multiPassRenderer.getRenderFlag();
      this.layer.multiPassRenderer.setRenderFlag(false);
      // trigger hooks
      layer.hooks.beforePickingEncode.call();
      layer.render();
      layer.hooks.afterPickingEncode.call();
      this.layer.multiPassRenderer.setRenderFlag(originRenderFlag);

      this.alreadyInRendering = false;
    });
  }

  /**
   * 拾取视口指定坐标属于的要素
   * TODO：支持区域拾取
   */
  private pickFromPickingFBO = ({ x, y, lngLat, type }: IInteractionTarget) => {
    if (!this.layer.isVisible() || !this.layer.needPick(type)) {
      return;
    }
    const { getViewportSize, readPixels, useFramebuffer } =
      this.rendererService;
    const { width, height } = getViewportSize();
    const { enableHighlight, enableSelect } = this.layer.getLayerConfig();

    const xInDevicePixel = x * DOM.DPR;
    const yInDevicePixel = y * DOM.DPR;
    if (
      xInDevicePixel > width ||
      xInDevicePixel < 0 ||
      yInDevicePixel > height ||
      yInDevicePixel < 0
    ) {
      return;
    }
    let pickedColors: Uint8Array | undefined;
    useFramebuffer(this.pickingFBO, () => {
      // avoid realloc
      pickedColors = readPixels({
        x: Math.round(xInDevicePixel),
        // 视口坐标系原点在左上，而 WebGL 在左下，需要翻转 Y 轴
        y: Math.round(height - (y + 1) * DOM.DPR),
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
        const rawFeature = this.layer
          .getSource()
          .getFeatureById(pickedFeatureIdx);
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
          this.layer.setCurrentPickId(pickedFeatureIdx);
          this.triggerHoverOnLayer(target);
        }
      } else {
        const target = {
          x,
          y,
          lngLat,
          type:
            this.layer.getCurrentPickId() === null ? 'un' + type : 'mouseout',
          featureId: null,
          feature: null,
        };
        this.triggerHoverOnLayer({
          ...target,
          type: 'unpick',
        });
        this.triggerHoverOnLayer(target);
        this.layer.setCurrentPickId(null);
      }

      if (enableHighlight) {
        this.highlightPickedFeature(pickedColors);
      }
      if (
        enableSelect &&
        type === 'click' &&
        pickedColors?.toString() !== [0, 0, 0, 0].toString()
      ) {
        this.selectFeature(pickedColors);
      }
    });
  };

  private triggerHoverOnLayer(target: {
    x: number;
    y: number;
    type: string;
    lngLat: ILngLat;
    feature: unknown;
    featureId: number | null;
  }) {
    this.layer.emit(target.type, target);
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
  private highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    this.layer.hooks.beforeHighlight.call([r, g, b]);
    this.layerService.renderLayers();
  }

  private selectFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    this.layer.hooks.beforeSelect.call([r, g, b]);
    this.layerService.renderLayers();
  }

  private selectFeatureHandle({ featureId }: Partial<IInteractionTarget>) {
    const pickedColors = encodePickingColor(featureId as number);
    this.selectFeature(new Uint8Array(pickedColors));
  }

  private highlightFeatureHandle({ featureId }: Partial<IInteractionTarget>) {
    const pickedColors = encodePickingColor(featureId as number);
    this.highlightPickedFeature(new Uint8Array(pickedColors));
  }
}
