const TYPES = {
  IGlobalConfigService: Symbol.for('IGlobalConfigService'),
  ICameraService: Symbol.for('ICameraService'),
  ICoordinateSystemService: Symbol.for('ICoordinateSystemService'),
  ILayerService: Symbol.for('ILayerService'),
  ILayerMappingService: Symbol.for('ILayerMappingService'),
  ILayerStyleService: Symbol.for('ILayerStyleService'),
  ILogService: Symbol.for('ILogService'),
  IMapService: Symbol.for('IMapService'),
  IRendererService: Symbol.for('IRendererService'),
  IShaderModuleService: Symbol.for('IShaderModuleService'),
  IIconService: Symbol.for('IIconService'),
  IFontService: Symbol.for('IFontService'),
  IInteractionService: Symbol.for('IInteractionService'),
  IControlService: Symbol.for('IControlService'),

  /** multi-pass */
  ClearPass: Symbol.for('ClearPass'),
  RenderPass: Symbol.for('RenderPass'),
  CopyPass: Symbol.for('CopyPass'),
  BlurHPass: Symbol.for('BlurHPass'),
  BlurVPass: Symbol.for('BlurVPass'),
};

export { TYPES };
