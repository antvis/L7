import {
  createLayerContainer,
  ILayer,
  IMapService,
  IRendererService,
} from '@antv/l7-core';
import { DOM, Tile } from '@antv/l7-utils';
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
  if (!!(container as HTMLCanvasElement).getContext) {
    return {
      width: (container as HTMLCanvasElement).width / DOM.DPR,
      height: (container as HTMLCanvasElement).height / DOM.DPR,
    };
  } else {
    return container.getBoundingClientRect();
  }
}

export function readRasterValue(
  tile: Tile,
  mapService: IMapService,
  x: number,
  y: number,
) {
  const bbox = tile?.bboxPolygon?.bbox || [0, 0, 10, -10];

  const [minLng = 0, minLat = 0, maxLng = 10, maxLat = -10] = bbox;

  const tileXY = mapService.lngLatToContainer([minLng, minLat]);
  const tileMaxXY = mapService.lngLatToContainer([maxLng, maxLat]);

  const tilePixelWidth = tileMaxXY.x - tileXY.x;
  const tilePixelHeight = tileXY.y - tileMaxXY.y;
  const pos = [
    (x - tileXY.x) / tilePixelWidth, // x
    (y - tileMaxXY.y) / tilePixelHeight, // y
  ];

  const tileWidth = tile?.data?.width || 1;
  const tileHeight = tile?.data?.height || 1;

  const indexX = Math.floor(pos[0] * tileWidth);
  const indexY = Math.floor(pos[1] * tileHeight);
  const index = Math.max(0, indexY - 1) * tileWidth + indexX;

  const data = tile?.data?.data[index];

  return data;
}

export function readPixel(
  x: number,
  y: number,
  rendererService: IRendererService,
) {
  const { readPixels, getContainer } = rendererService;
  const xInDevicePixel = x * DOM.DPR;
  const yInDevicePixel = y * DOM.DPR;
  let { width, height } = getContainerSize(
    getContainer() as HTMLCanvasElement | HTMLElement,
  );
  width *= DOM.DPR;
  height *= DOM.DPR;
  if (
    xInDevicePixel > width - 1 * DOM.DPR ||
    xInDevicePixel < 0 ||
    yInDevicePixel > height - 1 * DOM.DPR ||
    yInDevicePixel < 0
  ) {
    return false;
  }

  const pickedColors = readPixels({
    x: Math.floor(xInDevicePixel),
    // 视口坐标系原点在左上，而 WebGL 在左下，需要翻转 Y 轴
    y: Math.floor(height - (y + 1) * DOM.DPR),
    width: 1,
    height: 1,
    data: new Uint8Array(1 * 1 * 4),
  });
  return pickedColors;
}
