const TYPES = {
  IEventEmitter: Symbol.for('IEventEmitter'),
  ISceneService: Symbol.for('ISceneService'),
  IGlobalConfigService: Symbol.for('IGlobalConfigService'),
  ICameraService: Symbol.for('ICameraService'),
  ICoordinateSystemService: Symbol.for('ICoordinateSystemService'),
  ILayerService: Symbol.for('ILayerService'),
  ILayerMappingService: Symbol.for('ILayerMappingService'),
  ILayerStyleService: Symbol.for('ILayerStyleService'),
  IMapService: Symbol.for('IMapService'),
  IMarkerService: Symbol.for('IMarkerService'),
  IPopupService: Symbol.for('PopupService'),
  IFactoryMapService: Symbol.for('Factory<IMapService>'),
  IRendererService: Symbol.for('IRendererService'),
  IShaderModuleService: Symbol.for('IShaderModuleService'),
  
  
  IInteractionService: Symbol.for('IInteractionService'),
  IControlService: Symbol.for('IControlService'),
  IStyleAttributeService: Symbol.for('IStyleAttributeService'),
  ILayer: Symbol.for('ILayer'),
  ILayerPlugin: Symbol.for('ILayerPlugin'),
  INormalPass: Symbol.for('INormalPass'),
  IPostProcessor: Symbol.for('IPostProcessor'),
  IPostProcessingPass: Symbol.for('IPostProcessingPass'),
  IFactoryPostProcessingPass: Symbol.for('Factory<IPostProcessingPass>'),
  IFactoryNormalPass: Symbol.for('Factory<IFactoryNormalPass>'),
  SceneID: Symbol.for('SceneID'),
  MapConfig: Symbol.for('MapConfig'),
};

export { TYPES };
