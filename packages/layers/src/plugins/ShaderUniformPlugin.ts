import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
  ILayer,
  ILayerPlugin,
  IMapService,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { $window } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

/**
 * 在渲染之前需要获取当前 Shader 所需 Uniform，例如：
 * 1. 从相机服务中获取 View & ProjectionMatrix，当前缩放等级等等
 * 2. 从坐标系服务中获取当前坐标系，例如是否是偏移坐标系
 *    @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/doml91
 * 3. 当前 Layer 本身的样式属性
 */
@injectable()
export default class ShaderUniformPlugin implements ILayerPlugin {
  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

  public apply(layer: ILayer) {
    const version = this.mapService.version;

    let mvp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // default matrix (for gaode2.x)
    let sceneCenterMKT = [0, 0];
    layer.hooks.beforeRender.tap('ShaderUniformPlugin', () => {
      // @ts-ignore
      const offset = layer.getLayerConfig().tileOrigin;
      // 重新计算坐标系参数
      this.coordinateSystemService.refresh(offset);

      if (version === 'GAODE2.x') {
        this.setLayerCenter(layer);
        // @ts-ignore
        mvp = this.mapService.map.customCoords.getMVPMatrix();
        // mvp = amapCustomCoords.getMVPMatrix()
        // @ts-ignore
        sceneCenterMKT = this.mapService.getCustomCoordCenter();
      }

      const { width, height } = this.rendererService.getViewportSize();
      layer.models.forEach((model) => {
        model.addUniforms({
          // 相机参数，包含 VP 矩阵、缩放等级
          [CameraUniform.ProjectionMatrix]:
            this.cameraService.getProjectionMatrix(),
          [CameraUniform.ViewMatrix]: this.cameraService.getViewMatrix(),
          [CameraUniform.ViewProjectionMatrix]:
            this.cameraService.getViewProjectionMatrix(),
          [CameraUniform.Zoom]: this.cameraService.getZoom(),
          [CameraUniform.ZoomScale]: this.cameraService.getZoomScale(),
          [CameraUniform.FocalDistance]: this.cameraService.getFocalDistance(),
          [CameraUniform.CameraPosition]:
            this.cameraService.getCameraPosition(),
          // 坐标系参数
          [CoordinateUniform.CoordinateSystem]:
            this.coordinateSystemService.getCoordinateSystem(),
          [CoordinateUniform.ViewportCenter]:
            this.coordinateSystemService.getViewportCenter(),
          [CoordinateUniform.ViewportCenterProjection]:
            this.coordinateSystemService.getViewportCenterProjection(),
          [CoordinateUniform.PixelsPerDegree]:
            this.coordinateSystemService.getPixelsPerDegree(),
          [CoordinateUniform.PixelsPerDegree2]:
            this.coordinateSystemService.getPixelsPerDegree2(),
          [CoordinateUniform.PixelsPerMeter]:
            this.coordinateSystemService.getPixelsPerMeter(),
          // 坐标系是高德2.0的时候单独计算
          [CoordinateUniform.Mvp]: mvp,
          u_SceneCenterMKT: sceneCenterMKT,
          // 其他参数，例如视口大小、DPR 等
          u_ViewportSize: [width, height],
          u_ModelMatrix: this.cameraService.getModelMatrix(),
          u_DevicePixelRatio: $window.devicePixelRatio,
          // u_ModelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          u_PickingBuffer: layer.getLayerConfig().pickingBuffer || 0,
          // Tip: 当前地图是否在拖动
          u_shaderPick: Number(layer.getShaderPickStat()),
        });
      });

      // TODO：脏检查，决定是否需要渲染
    });
  }

  /**
   * 对于每个 layer 都有不同的几何中心点，因此在绘制每个 layer 的时候都需要重新设置
   * @param layer
   */
  private setLayerCenter(layer: ILayer) {
    if (layer.coordCenter === undefined) {
      layer.coordCenter = layer.getSource().center;
    }
    if (this.mapService.setCoordCenter) {
      this.mapService.setCoordCenter(layer.coordCenter);
    }
  }
}
