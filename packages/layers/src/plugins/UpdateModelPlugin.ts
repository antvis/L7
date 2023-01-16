import { ILayer, ILayerPlugin } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
/**
 * Model 更新
 */
@injectable()
export default class UpdateModelPlugin implements ILayerPlugin {
  public apply(layer: ILayer) {}
}
