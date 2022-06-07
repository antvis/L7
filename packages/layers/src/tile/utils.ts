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

export function getLayerShape(layerType: string, layer: ILayer) {
  const layerShape = layer.getAttribute('shape');
  if (layerShape && layerShape.scale?.field) {
    if(layerShape.scale?.values === 'text') {
      return [layerShape.scale.field, layerShape.scale.values] as string[];
    }
    return layerShape.scale.field as string;
  }
  switch (layerType) {
    case 'PolygonLayer':
      return 'fill';
    case 'LineLayer':
      return 'tileline';
    case 'PointLayer':
      return 'circle';
    case 'RasterLayer':
      return 'image';
    default:
      return '';
  }
}

export function getMaskValue(layerType: string, mask: boolean) {
  switch (layerType) {
    case 'PolygonLayer':
      return true;
    case 'LineLayer':
      return true;
    case 'PointLayer':
      return false;
    case 'RasterLayer':
      return mask;
    default:
      return mask;
  }
}
