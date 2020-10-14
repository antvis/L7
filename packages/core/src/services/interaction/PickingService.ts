import { decodePickingColor, encodePickingColor } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import {
  IMapService,
  IRendererService,
  IShaderModuleService,
} from '../../index';
import { TYPES } from '../../types';
import { IGlobalConfigService, ISceneConfig } from '../config/IConfigService';
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

@injectable()
export default class PickingService implements IPickingService {
  @inject(TYPES.IRendererService)
  private rendererService: IRendererService;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.IInteractionService)
  private interactionService: IInteractionService;

  @inject(TYPES.ILayerService)
  private layerService: ILayerService;
  private pickingFBO: IFramebuffer;

  private width: number = 0;

  private height: number = 0;

  private alreadyInPicking: boolean = false;

  private pickBufferScale: number = 1.0;

  public init(id: string) {
    const {
      createTexture2D,
      createFramebuffer,
      getViewportSize,
      getContainer,
    } = this.rendererService;
    let {
      width,
      height,
    } = (getContainer() as HTMLElement).getBoundingClientRect();
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    this.pickBufferScale =
      this.configService.getSceneConfig(id).pickBufferScale || 1;
    // 创建 picking framebuffer，后续实时 resize
    this.pickingFBO = createFramebuffer({
      color: createTexture2D({
        width: Math.round(width / this.pickBufferScale),
        height: Math.round(height / this.pickBufferScale),
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
    const {
      getViewportSize,
      useFramebuffer,
      clear,
      getContainer,
    } = this.rendererService;
    let {
      width,
      height,
    } = (getContainer() as HTMLElement).getBoundingClientRect();
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    if (this.width !== width || this.height !== height) {
      this.pickingFBO.resize({
        width: Math.round(width / this.pickBufferScale),
        height: Math.round(height / this.pickBufferScale),
      });
      this.width = width;
      this.height = height;
    }

    useFramebuffer(this.pickingFBO, () => {
      const layers = this.layerService.getLayers();
      layers
        .filter((layer) => layer.needPick(target.type))
        .reverse()
        .some((layer) => {
          clear({
            framebuffer: this.pickingFBO,
            color: [0, 0, 0, 0],
            stencil: 0,
            depth: 1,
          });
          layer.hooks.beforePickingEncode.call();
          layer.renderModels();
          layer.hooks.afterPickingEncode.call();
          const isPicked = this.pickFromPickingFBO(layer, target);
          return isPicked && !layer.getLayerConfig().enablePropagation;
        });
    });
  }
  private pickFromPickingFBO = (
    layer: ILayer,
    { x, y, lngLat, type, target }: IInteractionTarget,
  ) => {
    let isPicked = false;
    const { getViewportSize, readPixels, getContainer } = this.rendererService;
    let {
      width,
      height,
    } = (getContainer() as HTMLElement).getBoundingClientRect();
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    const { enableHighlight, enableSelect } = layer.getLayerConfig();

    const xInDevicePixel = x * window.devicePixelRatio;
    const yInDevicePixel = y * window.devicePixelRatio;
    if (
      xInDevicePixel > width - 1 * window.devicePixelRatio ||
      xInDevicePixel < 0 ||
      yInDevicePixel > height - 1 * window.devicePixelRatio ||
      yInDevicePixel < 0
    ) {
      return false;
    }
    let pickedColors: Uint8Array | undefined;
    pickedColors = readPixels({
      x: Math.floor(xInDevicePixel / this.pickBufferScale),
      // 视口坐标系原点在左上，而 WebGL 在左下，需要翻转 Y 轴
      y: Math.floor(
        (height - (y + 1) * window.devicePixelRatio) / this.pickBufferScale,
      ),
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
      if (
        pickedFeatureIdx !== layer.getCurrentPickId() &&
        type === 'mousemove'
      ) {
        type = 'mouseenter';
      }

      const layerTarget = {
        x,
        y,
        type,
        lngLat,
        featureId: pickedFeatureIdx,
        feature: rawFeature,
        target,
      };
      if (!rawFeature) {
        // this.logger.error(
        //   '未找到颜色编码解码后的原始 feature，请检查 fragment shader 中末尾是否添加了 `gl_FragColor = filterColor(gl_FragColor);`',
        // );
      } else {
        // trigger onHover/Click callback on layer
        isPicked = true;
        layer.setCurrentPickId(pickedFeatureIdx);
        this.triggerHoverOnLayer(layer, layerTarget); // 触发拾取事件
      }
    } else {
      // 未选中
      const layerTarget = {
        x,
        y,
        lngLat,
        type:
          layer.getCurrentPickId() !== null && type === 'mousemove'
            ? 'mouseout'
            : 'un' + type,
        featureId: null,
        target,
        feature: null,
      };
      this.triggerHoverOnLayer(layer, {
        ...layerTarget,
        type: 'unpick',
      });
      this.triggerHoverOnLayer(layer, layerTarget);
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
      const selectedId = decodePickingColor(pickedColors);
      if (
        layer.getCurrentSelectedId() === null ||
        selectedId !== layer.getCurrentSelectedId()
      ) {
        this.selectFeature(layer, pickedColors);
        layer.setCurrentSelectedId(selectedId);
      } else {
        this.selectFeature(layer, new Uint8Array([0, 0, 0, 0])); // toggle select
        layer.setCurrentSelectedId(null);
      }
    }
    return isPicked;
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
