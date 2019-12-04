import {
  ILayer,
  ILayerPlugin,
  ILogService,
  IStyleAttributeService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
@injectable()
export default class UpdateStyleAttributePlugin implements ILayerPlugin {
  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tap('UpdateStyleAttributePlugin', () => {
      console.time('UpdateStyleAttributePlugin')
      const attributes = styleAttributeService.getLayerStyleAttributes() || [];
      attributes
        .filter((attribute) => attribute.needRegenerateVertices)
        .forEach((attribute) => {
          // 精确更新某个/某些 feature(s)，需要传入 featureIdx
          styleAttributeService.updateAttributeByFeatureRange(
            attribute.name,
            layer.getEncodedData(), // 获取经过 mapping 最新的数据
            attribute.featureRange.startIndex,
            attribute.featureRange.endIndex,
          );
          attribute.needRegenerateVertices = false;
          this.logger.debug(
            `regenerate vertex attributes: ${attribute.name} finished`,
          );
        });
        console.timeEnd('UpdateStyleAttributePlugin')
    });
  }
}
