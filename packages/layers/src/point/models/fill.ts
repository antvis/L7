import {
  ILayer,
  TYPES,
  IRendererService,
} from '@antv/l7-core';
export default class FillModel {
  protected layer: ILayer;
  protected rendererService: IRendererService;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);

  }

  public buildModels() {
    const { createModel } = this.rendererService;
    const model = createModel();
    return [model];
  }
}
