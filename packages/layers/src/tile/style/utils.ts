import {
    ILayer,
    IRendererService,
    ScaleAttributeType,
    IScaleValue
  } from '@antv/l7-core';

  import { generateColorRamp, IColorRamp } from '@antv/l7-utils';

export function updateTexture(config: IColorRamp, layers: ILayer[], rendererService: IRendererService) {
    const { createTexture2D } = rendererService;
    const imageData = generateColorRamp(config) as ImageData;
    const texture =  createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
    
    layers.map(layer => {
      layer.updateLayerConfig({
        colorTexture: texture
      });
    })
    return texture;
}

export function updateLayersConfig(layers: ILayer[], key: string, value: any) {
    layers.map((layer) => {
      if (key === 'mask') {
        // Tip: 栅格瓦片生效、设置全局的 mask、瓦片被全局的 mask 影响
        layer.style({
          mask: value,
        });
      } else {
        layer.updateLayerConfig({
          [key]: value,
        });
      }
    });
  }

export function setStyleAttributeField(
  layer: ILayer,
  parent: ILayer,
  style: ScaleAttributeType,
  value: IScaleValue | undefined | string | string[],
) {
  if (Array.isArray(value)) {
    // @ts-ignore
    layer[style](...value);
    return;
  }
  if (typeof value === 'string') {
    layer[style](value);
    return;
  }
  const defaultValue = getDefaultStyleAttributeField(layer, parent.type, style);
  if (!value) {
    layer[style](defaultValue);
    return layer;
  }
  const params = parseScaleValue(value, style);
  if (params.length === 0) {
    layer[style](defaultValue);
  } else {
    // @ts-ignore
    layer[style](...params);
  }
}

export function getDefaultStyleAttributeField(layer: ILayer, type: string, style: string) {
  switch (style) {
    case 'size':
      return 1;
    case 'color':
      return '#fff';
    case 'shape':
      return getLayerShape(type, layer);
    default:
      return '';
  }
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

export function parseScaleValue(value: IScaleValue | string, type: string) {
  if (type === 'shape') {
    if (typeof value === 'string') {
      return [value];
    } else if (value?.field) {
      return [value?.field];
    } else {
      return [];
    }
  }
  const { field, values, callback } = value as IScaleValue;
  if (field && values && Array.isArray(values)) {
    return [field, values];
  } else if (field && callback) {
    return [field, callback];
  } else if (field) {
    return [field];
  }
  return [];
}

export function setScale(layer: ILayer, parent: ILayer) {
  const scaleOptions = parent.tileLayer.scaleField;
  const scaleKeys = Object.keys(scaleOptions);
  scaleKeys.map((key) => {
    layer.scale(key, scaleOptions[key]);
  });
}