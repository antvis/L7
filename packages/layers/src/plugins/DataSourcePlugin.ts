import { ILayer, ILayerPlugin } from '@l7/core';
import Source from '@l7/source';
export default class DataSourcePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.init.tap('DataSourcePlugin', () => {
      const { data, options } = layer.sourceOption;
      // @ts-ignore
      layer.setSource(new Source(data, options));
    });
  }
}
