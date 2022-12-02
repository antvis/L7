import { ILayer, ILayerPlugin, IModel } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
  }
}
