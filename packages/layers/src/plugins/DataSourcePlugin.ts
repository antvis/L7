import { ILayer, ILayerPlugin } from '@l7/core';
import Source from '@l7/source';
import { injectable } from 'inversify';

@injectable()
export default class DataSourcePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.init.tap('DataSourcePlugin', () => {
      const { data, options } = layer.sourceOption;
      layer.setSource(new Source(data, options));
    });
  }
}
