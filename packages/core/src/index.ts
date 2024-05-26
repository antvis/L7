export { default as BasePostProcessingPass } from './services/renderer/passes/BasePostProcessingPass';
export { removeDuplicateUniforms } from './utils/shader-module';
export { packCircleVertex } from './utils/vertex-compression';

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
export * from './inversify.config';
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
/** 地图类基类 */
export * from './services/map/base-map';
export * from './services/map/base-map-wrapper';
export * from './services/map/web-mercator-viewport';
