import container, { lazyInject } from './inversify.config';
import ClearPass from './services/renderer/passes/ClearPass';
import BlurHPass from './services/renderer/passes/post-processing/BlurHPass';
import BlurVPass from './services/renderer/passes/post-processing/BlurVPass';
import CopyPass from './services/renderer/passes/post-processing/CopyPass';
import RenderPass from './services/renderer/passes/RenderPass';
import SceneService from './services/scene/SceneService';
import { TYPES } from './types';
import { packCircleVertex } from './utils/vertex-compression';

export {
  /**
   * IoC 容器
   */
  container,
  /**
   * lazy inject，供各个 Layer 使用
   */
  lazyInject,
  /**
   * 各个 Service 接口标识符
   */
  TYPES,
  /**
   * 各个 Service 接口
   */
  SceneService,
  packCircleVertex,
  /** pass */
  ClearPass,
  RenderPass,
  BlurHPass,
  BlurVPass,
  CopyPass,
};

/** 暴露服务接口供其他 packages 实现 */
export * from './services/layer/ILayerStyleService';
export * from './services/layer/ILayerService';
export * from './services/source/ISourceService';
export * from './services/map/IMapService';
export * from './services/coordinate/ICoordinateSystemService';
export * from './services/renderer/IRendererService';
export * from './services/camera/ICameraService';
export * from './services/config/IConfigService';
export * from './services/scene/ISceneService';
export * from './services/shader/IShaderModuleService';

/** 全部渲染服务接口 */
export * from './services/renderer/IAttribute';
export * from './services/renderer/IBuffer';
export * from './services/renderer/IElements';
export * from './services/renderer/IFramebuffer';
export * from './services/renderer/IModel';
export * from './services/renderer/IMultiPassRenderer';
export * from './services/renderer/IRenderbuffer';
export * from './services/renderer/ITexture2D';
export * from './services/renderer/IUniform';
export * from './services/renderer/gl';
