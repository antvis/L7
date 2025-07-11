import type {
  IBuffer,
  ICameraService,
  ICoordinateSystemService,
  ILayer,
  ILayerPlugin,
  ILayerService,
  IMapService,
  IRendererService,
  L7Container,
} from '@antv/l7-core';
import { CameraUniform, CoordinateUniform } from '@antv/l7-core';

/**
 * 在渲染之前需要获取当前 Shader 所需 Uniform，例如：
 * 1. 从相机服务中获取 View & ProjectionMatrix，当前缩放等级等等
 * 2. 从坐标系服务中获取当前坐标系，例如是否是偏移坐标系
 *    @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/doml91
 * 3. 当前 Layer 本身的样式属性
 */
export default class ShaderUniformPlugin implements ILayerPlugin {
  private cameraService: ICameraService;
  private coordinateSystemService: ICoordinateSystemService;
  private rendererService: IRendererService;
  private mapService: IMapService;
  private layerService: ILayerService;

  public apply(
    layer: ILayer,
    {
      rendererService,
      mapService,
      layerService,
      coordinateSystemService,
      cameraService,
    }: L7Container,
  ) {
    this.rendererService = rendererService;
    this.mapService = mapService;
    this.layerService = layerService;
    this.coordinateSystemService = coordinateSystemService;
    this.cameraService = cameraService;

    let uniformBuffer: IBuffer;
    if (!this.rendererService.uniformBuffers[0]) {
      // Create a Uniform Buffer Object(UBO).
      // Size calculation: 4 mat4 (64) + 1 vec4 (4) + 4 vec3->vec4 (16) + 3 vec4 packed (12) = 96 floats
      uniformBuffer = this.rendererService.createBuffer({
        data: new Float32Array(96),
        isUBO: true,
        label: 'renderUniformBuffer',
      });
      this.rendererService.uniformBuffers[0] = uniformBuffer;
    }

    layer.hooks.beforeRender.tap('ShaderUniformPlugin', () => {
      // 获取图层的相对坐标原点
      const layerRelativeOrigin = layer.getRelativeOrigin && layer.getRelativeOrigin();
      const relativeOrigin = layerRelativeOrigin || [0, 0];

      // 重新计算坐标系参数
      this.coordinateSystemService.refresh();

      // 特殊处理：如果图层启用了相对坐标，强制设置ViewportCenter为RelativeOrigin
      // 这样可以避免shader中的精度问题
      const isUsingRelativeCoords =
        relativeOrigin &&
        (Math.abs(relativeOrigin[0]) > 0.0001 || Math.abs(relativeOrigin[1]) > 0.0001);
      if (isUsingRelativeCoords && this.coordinateSystemService.getCoordinateSystem() === 2) {
        // COORDINATE_SYSTEM_LNGLAT_OFFSET
        // 强制设置ViewportCenter为RelativeOrigin，避免shader中的大数计算
        this.coordinateSystemService.setViewportCenter(relativeOrigin);
      }
      const { width, height } = this.rendererService.getViewportSize();

      const { data, uniforms } = this.generateUBO(width, height, relativeOrigin);

      if (this.layerService.alreadyInRendering && this.rendererService.uniformBuffers[0]) {
        const renderUniformBuffer = this.rendererService.uniformBuffers[0];
        // Update only once since all models can share one UBO.
        renderUniformBuffer.subData({
          offset: 0,
          data,
        });
      }

      // For WebGL1. regl
      const platformString = this.rendererService.queryVerdorInfo();
      if (platformString === 'WebGL1') {
        layer.models.forEach((model) => {
          model.addUniforms({
            ...uniforms,
            // TODO: move these 2 uniforms to PixelPickingPlugin
            u_PickingBuffer: layer.getLayerConfig().pickingBuffer || 0,
            // Tip: 当前地图是否在拖动
            u_shaderPick: Number(layer.getShaderPickStat()),
          });
        });
      }
    });
  }

  private generateUBO(width: number, height: number, offset?: number[]) {
    const u_ProjectionMatrix = this.cameraService.getProjectionMatrix();
    const u_ViewMatrix = this.cameraService.getViewMatrix();
    const u_ViewProjectionMatrix = this.cameraService.getViewProjectionMatrix();
    const u_ModelMatrix = this.cameraService.getModelMatrix();
    const u_ViewportCenterProjection = this.coordinateSystemService.getViewportCenterProjection();
    const u_PixelsPerDegree = this.coordinateSystemService.getPixelsPerDegree();
    const u_Zoom = this.cameraService.getZoom();
    const u_PixelsPerDegree2 = this.coordinateSystemService.getPixelsPerDegree2();
    const u_ZoomScale = this.cameraService.getZoomScale();
    const u_PixelsPerMeter = this.coordinateSystemService.getPixelsPerMeter();
    const u_CoordinateSystem = this.coordinateSystemService.getCoordinateSystem();
    const u_CameraPosition = this.cameraService.getCameraPosition();
    const u_DevicePixelRatio = window.devicePixelRatio;
    const u_ViewportCenter = this.coordinateSystemService.getViewportCenter();
    const u_ViewportSize = [width, height];
    const u_FocalDistance = this.cameraService.getFocalDistance();
    const u_RelativeOrigin = offset && offset.length >= 2 ? [offset[0], offset[1]] : [0, 0];

    const data: number[] = [
      ...u_ViewMatrix, // 16
      ...u_ProjectionMatrix, // 16
      ...u_ViewProjectionMatrix, // 16
      ...u_ModelMatrix, // 16
      ...u_ViewportCenterProjection, // 4
      ...u_PixelsPerDegree, // 4
      u_Zoom,
      ...u_PixelsPerDegree2, // 4
      u_ZoomScale,
      ...u_PixelsPerMeter, // 4
      u_CoordinateSystem,
      ...u_CameraPosition, // 4
      u_DevicePixelRatio, // 4
      ...u_ViewportCenter,
      ...u_ViewportSize, // 4
      u_FocalDistance, // 1
      ...u_RelativeOrigin, // 2
      0, // padding
    ];

    return {
      data,
      uniforms: {
        // 相机参数，包含 VP 矩阵、缩放等级
        [CameraUniform.ProjectionMatrix]: u_ProjectionMatrix,
        [CameraUniform.ViewMatrix]: u_ViewMatrix,
        [CameraUniform.ViewProjectionMatrix]: u_ViewProjectionMatrix,
        [CameraUniform.Zoom]: u_Zoom,
        [CameraUniform.ZoomScale]: u_ZoomScale,
        [CameraUniform.FocalDistance]: u_FocalDistance,
        [CameraUniform.CameraPosition]: u_CameraPosition,
        // 坐标系参数
        [CoordinateUniform.CoordinateSystem]: u_CoordinateSystem,
        [CoordinateUniform.ViewportCenter]: u_ViewportCenter,
        [CoordinateUniform.ViewportCenterProjection]: u_ViewportCenterProjection,
        [CoordinateUniform.PixelsPerDegree]: u_PixelsPerDegree,
        [CoordinateUniform.PixelsPerDegree2]: u_PixelsPerDegree2,
        [CoordinateUniform.PixelsPerMeter]: u_PixelsPerMeter,

        // 其他参数，例如视口大小、DPR 等
        u_ViewportSize: u_ViewportSize,
        u_ModelMatrix,
        u_DevicePixelRatio: u_DevicePixelRatio,
        // 相对原点坐标
        u_RelativeOrigin: u_RelativeOrigin,
      },
    };
  }
}
