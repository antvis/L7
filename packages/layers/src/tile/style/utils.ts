import {
    ILayer,
    IRendererService,
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