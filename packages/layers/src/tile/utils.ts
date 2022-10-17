import { createLayerContainer, ILayer, ILayerService } from '@antv/l7-core';
import { DOM, Tile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { updateLayersConfig } from './style/utils';

export const tileVectorParser = ['mvt', 'geojsonvt', 'testTile'];

/**
 * 判断当前图层是否是瓦片图层
 * @param layer
 * @returns
 */
export function isTileGroup(layer: ILayer) {
  const source = layer.getSource();
  return tileVectorParser.includes(source.parser.type);
}

export function isVectorTile(parserType: string) {
  return tileVectorParser.indexOf(parserType) >= 0;
}

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
    if (layerShape.scale?.values === 'text') {
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

export function getContainerSize(container: HTMLCanvasElement | HTMLElement) {
  if ((container as HTMLCanvasElement).getContext) {
    return {
      width: (container as HTMLCanvasElement).width / DOM.DPR,
      height: (container as HTMLCanvasElement).height / DOM.DPR,
    };
  } else {
    return container.getBoundingClientRect();
  }
}

export function isTileLoaded(tile: Tile) {
  return tile.layerIDList.length === tile.loadedLayers;
}

export function isTileChildLoaded(tile: Tile) {
  const children = tile.children;
  return (
    children.filter((child) => isTileLoaded(child)).length === children.length
  );
}

export function isTileParentLoaded(tile: Tile) {
  const parent = tile.parent;
  if (!parent) {
    return true;
  } else {
    return isTileLoaded(parent);
  }
}

export function tileAllLoad(tile: Tile, callback: () => void) {
  const timer = window.setInterval(() => {
    const tileLoaded = isTileLoaded(tile);
    const tileChildLoaded = isTileChildLoaded(tile);
    const tileParentLoaded = isTileParentLoaded(tile);
    if (tileLoaded && tileChildLoaded && tileParentLoaded) {
      callback();
      window.clearInterval(timer);
    }
  }, 36);
}

function dispatchTileVisibleChange(tile: Tile, callback: () => void) {
  if (tile.isVisible) {
    callback();
  } else {
    tileAllLoad(tile, () => {
      callback();
    });
  }
}

function updateImmediately(layers: ILayer[]) {
  let immediately = true;
  layers.map((layer) => {
    if (layer.type !== 'PointLayer') {
      immediately = false;
    }
  });
  return immediately;
}

export function updateTileVisible(
  tile: Tile,
  layers: ILayer[],
  layerService: ILayerService,
) {
  if (layers.length === 0) return;

  if (updateImmediately(layers)) {
    updateLayersConfig(layers, 'visible', tile.isVisible);
    layerService.reRender();
    return;
  }

  dispatchTileVisibleChange(tile, () => {
    updateLayersConfig(layers, 'visible', tile.isVisible);
    layerService.reRender();
  });
}
