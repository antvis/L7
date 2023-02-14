import container, {
  createLayerContainer,
  createSceneContainer,
  lazyInject,
  lazyMultiInject,
} from './inversify.config';
import BasePostProcessingPass from './services/renderer/passes/BasePostProcessingPass';
import { TYPES } from './types';
import { packCircleVertex } from './utils/vertex-compression';

export * from './services/asset/IFontService';
export * from './services/asset/IIconService';
export * from './services/asset/ITextureService';
export * from './services/camera/ICameraService';
export * from './services/component/IControlService';
export * from './services/component/IMarkerService';
export * from './services/component/IPopupService';
export * from './services/config/IConfigService';
export * from './services/coordinate/ICoordinateSystemService';
export * from './services/debug/IDebugService';
export * from './services/interaction/IInteractionService';
export * from './services/interaction/IPickingService';
/** 暴露服务接口供其他 packages 实现 */
export * from './services/layer/ILayerService';
export * from './services/layer/IStyleAttributeService';
export * from './services/map/IMapService';
export * from './services/renderer/gl';
/** 全部渲染服务接口 */
export * from './services/renderer/IAttribute';
export * from './services/renderer/IBuffer';
export * from './services/renderer/IElements';
export * from './services/renderer/IFramebuffer';
export * from './services/renderer/IModel';
export * from './services/renderer/IMultiPassRenderer';
export * from './services/renderer/IRenderbuffer';
export * from './services/renderer/IRendererService';
export * from './services/renderer/ITexture2D';
export * from './services/renderer/IUniform';
export * from './services/scene/ISceneService';
export * from './services/shader/IShaderModuleService';
export * from './services/source/ISourceService';
export {
  container,
  createSceneContainer,
  createLayerContainer,
  /**
   * lazy inject，供各个 Layer 使用
   */
  lazyInject,
  lazyMultiInject,
  /**
   * 各个 Service 接口标识符
   */
  TYPES,
  packCircleVertex,
  BasePostProcessingPass,
};
