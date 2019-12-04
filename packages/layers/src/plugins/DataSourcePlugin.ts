import { ILayer, ILayerPlugin } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { injectable } from 'inversify';

@injectable()
export default class DataSourcePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.init.tap('DataSourcePlugin', () => {
      console.time('DataSourcePlugin')
      const { data, options } = layer.sourceOption;
      layer.setSource(new Source(data, options));
      console.timeEnd('DataSourcePlugin')
    });
  }
}
