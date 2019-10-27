import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILogService,
  lazyInject,
  TYPES,
} from '@l7/core';

/**
 * Layer 初始化阶段以及重绘阶段首先校验传入参数，如果校验失败则中断后续插件处理。
 */
export default class ConfigSchemaValidationPlugin implements ILayerPlugin {
  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.ILogService)
  private readonly logger: ILogService;

  public apply(layer: ILayer) {
    layer.hooks.init.tap('ConfigSchemaValidationPlugin', () => {
      this.configService.registerLayerConfigSchemaValidator(
        layer.name,
        layer.getConfigSchemaForValidation(),
      );

      const { valid, errorText } = this.configService.validateLayerConfig(
        layer.name,
        layer.getStyleOptions(),
      );

      if (!valid) {
        this.logger.error(errorText || '');
        // 中断 init 过程
        return false;
      }
    });
    layer.hooks.beforeRender.tap('ConfigSchemaValidationPlugin', () => {
      // TODO: 配置项发生变化，需要重新校验
    });
  }
}
