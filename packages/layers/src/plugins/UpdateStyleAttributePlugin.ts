import { ILayer, ILayerPlugin, ILogService, lazyInject, TYPES } from '@l7/core';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
export default class UpdateStyleAttributePlugin implements ILayerPlugin {
  @lazyInject(TYPES.ILogService)
  private readonly logger: ILogService;

  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('UpdateStyleAttributePlugin', () => {
      const attributes =
        layer.styleAttributeService.getLayerStyleAttributes() || [];
      attributes
        .filter((attribute) => attribute.needRegenerateVertices)
        .forEach((attribute) => {
          // 精确更新某个/某些 feature(s)，需要传入 featureIdx
          layer.styleAttributeService.updateAttributeByFeatureRange(
            attribute.name,
            layer.getEncodedData(), // 获取经过 mapping 最新的数据
            attribute.featureRange.startIndex,
            attribute.featureRange.endIndex,
          );
          attribute.needRegenerateVertices = false;
          this.logger.info(
            `regenerate vertex attributes: ${attribute.name} finished`,
          );
        });
    });
  }
}
