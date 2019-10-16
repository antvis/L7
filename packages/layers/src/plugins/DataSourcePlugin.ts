import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILayerStyleAttribute,
  IParseDataItem,
  IStyleScale,
  lazyInject,
  StyleScaleType,
  TYPES,
} from '@l7/core';
import { ISourceCFG } from '@l7/core';
import Source from '@l7/source';
export default class DataSourcePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.init.tap('DataSourcePlugin', () => {
      const { data, options } = layer.sourceOption;
      layer.setSource(new Source(data, options));
    });
  }
}
