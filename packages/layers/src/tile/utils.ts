import { createLayerContainer, ILayer } from '@antv/l7-core';
import { Container } from 'inversify';
export function registerLayers(parentLayer: ILayer, layers: ILayer[]) {
  layers.map((layer) => {
    const container = createLayerContainer(
      parentLayer.sceneContainer as Container,
    );
    layer.setContainer(container, parentLayer.sceneContainer as Container);
    layer.init();
  });
}
