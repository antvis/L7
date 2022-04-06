import { ILayer, ILayerGroup } from '@antv/l7-core';
import BaseLayer from './BaseLayer';

// 定义 LayerGroup 继承 Baselayer

export default class LayerGroup<ChildLayerStyleOptions = {}> extends BaseLayer
  implements ILayerGroup {
  public isLayerGroup: boolean = true;

  public addChild(layer: ILayer) {
    this.layerChildren.push(layer);
  }

  public removeChild(layer: ILayer) {
    const layerIndex = this.layerChildren.indexOf(layer);
    if (layerIndex > -1) {
      this.layerChildren.splice(layerIndex, 1);
    }
    layer.destroy();
  }

  public clearChild() {
    this.layerChildren.forEach((layer: any) => {
      layer.destroy();
    });

    this.layerChildren = [];
  }
}
