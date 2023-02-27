import { ILayer } from '@antv/l7-core';

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
