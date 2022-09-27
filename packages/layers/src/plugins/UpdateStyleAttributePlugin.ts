import { ILayer, ILayerPlugin, IStyleAttributeService } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';

/**
 * 在初始化阶段完成属性的注册，以及首次根据 Layer 指定的三角化方法完成 indices 和 attribute 的创建
 */
@injectable()
export default class UpdateStyleAttributePlugin implements ILayerPlugin {
  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tap('UpdateStyleAttributePlugin', () => {
      this.initStyleAttribute(layer, { styleAttributeService });
    });

    layer.hooks.beforeRender.tap('UpdateStyleAttributePlugin', () => {
      const { usage } = layer.getLayerConfig();
      if (
        layer.layerModelNeedUpdate ||
        layer.tileLayer ||
        usage === 'basemap'
      ) {
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
    if (filter && filter.needRegenerateVertices) {
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
      });
  }
}
