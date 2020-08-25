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
      this.initStyleAttribute(layer, { styleAttributeService });
    });

    // layer.hooks.beforeRenderData.tap('styleAttributeService', () => {
    //   // layer.layerModelNeedUpdate = true;
    //   return true;
    // });

    layer.hooks.beforeRender.tap('UpdateStyleAttributePlugin', () => {
      if (layer.layerModelNeedUpdate) {
        return;
      }
      this.updateStyleAtrribute(layer, { styleAttributeService });
    });
  }
  private updateStyleAtrribute(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    const attributes = styleAttributeService.getLayerStyleAttributes() || [];
    const filter = styleAttributeService.getLayerStyleAttribute('filter');
    const shape = styleAttributeService.getLayerStyleAttribute('shape');
    if (
      (filter && filter.needRegenerateVertices) ||
      (shape && shape.needRegenerateVertices) // TODO:Shape 更新重新build
    ) {
      layer.layerModelNeedUpdate = true;
      attributes.forEach((attr) => (attr.needRegenerateVertices = false));
      return;
    }
    attributes
      .filter((attribute) => attribute.needRegenerateVertices)
      .forEach((attribute) => {
        // 精确更新某个/某些 feature(s)，需要传入 featureIdx d
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
  }

  private initStyleAttribute(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    const attributes = styleAttributeService.getLayerStyleAttributes() || [];
    attributes
      .filter((attribute) => attribute.needRegenerateVertices)
      .forEach((attribute) => {
        // 精确更新某个/某些 feature(s)，需要传入 featureIdx d
        styleAttributeService.updateAttributeByFeatureRange(
          attribute.name,
          layer.getEncodedData(), // 获取经过 mapping 最新的数据
          attribute.featureRange.startIndex,
          attribute.featureRange.endIndex,
        );
        attribute.needRegenerateVertices = false;
        this.logger.debug(`init vertex attributes: ${attribute.name} finished`);
      });
  }
}
