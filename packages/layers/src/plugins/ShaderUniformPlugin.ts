import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
  ILayer,
  ILayerPlugin,
  IRendererService,
  lazyInject,
  TYPES,
} from '@l7/core';

/**
 * 在渲染之前需要获取当前 Shader 所需 Uniform，例如：
 * 1. 从相机服务中获取 View & ProjectionMatrix，当前缩放等级等等
 * 2. 从坐标系服务中获取当前坐标系，例如是否是偏移坐标系
 *    @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/doml91
 * 3. 当前 Layer 本身的样式属性
 */
export default class ShaderUniformPlugin implements ILayerPlugin {
  @lazyInject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @lazyInject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @lazyInject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('ShaderUniformPlugin', () => {
      // 重新计算坐标系参数
      this.coordinateSystemService.refresh();

      const { width, height } = this.rendererService.getViewportSize();

      layer.models.forEach((model) =>
        model.addUniforms({
          // 相机参数，包含 VP 矩阵、缩放等级
          [CameraUniform.ProjectionMatrix]: this.cameraService.getProjectionMatrix(),
          [CameraUniform.ViewMatrix]: this.cameraService.getViewMatrix(),
          [CameraUniform.ViewProjectionMatrix]: this.cameraService.getViewProjectionMatrix(),
          [CameraUniform.Zoom]: this.cameraService.getZoom(),
          [CameraUniform.ZoomScale]: this.cameraService.getZoomScale(),
          [CameraUniform.FocalDistance]: this.cameraService.getFocalDistance(),
          // 坐标系参数
          [CoordinateUniform.CoordinateSystem]: this.coordinateSystemService.getCoordinateSystem(),
          [CoordinateUniform.ViewportCenter]: this.coordinateSystemService.getViewportCenter(),
          [CoordinateUniform.ViewportCenterProjection]: this.coordinateSystemService.getViewportCenterProjection(),
          [CoordinateUniform.PixelsPerDegree]: this.coordinateSystemService.getPixelsPerDegree(),
          [CoordinateUniform.PixelsPerDegree2]: this.coordinateSystemService.getPixelsPerDegree2(),
          [CoordinateUniform.PixelsPerMeter]: this.coordinateSystemService.getPixelsPerMeter(),
          // 其他参数，例如视口大小、DPR 等
          u_ViewportSize: [width, height],
          u_DevicePixelRatio: window.devicePixelRatio,
        }),
      );

      // TODO：脏检查，决定是否需要渲染
    });
  }
}
