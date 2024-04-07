import { HeatmapLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: { map: string; renderer: string }) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer,
    enableWebGPU: true,
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });

  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
      .then((res) => res.json())
      .then((data) => {
        const layer = new HeatmapLayer({ autoFit: true })
          .source(data, {
            transforms: [
              {
                type: 'grid',
                size: 150000,
                field: 'mag',
                method: 'sum',
              },
            ],
          })
          .size('sum', (sum) => {
            return sum * 2000;
          })
          .shape('hexagonColumn')
          .style({
            coverage: 0.8,
            angle: 0,
          })
          .active(true)
          .color(
            'count',
            [
              '#0B0030',
              '#100243',
              '#100243',
              '#1B048B',
              '#051FB7',
              '#0350C1',
              '#0350C1',
              '#0072C4',
              '#0796D3',
              '#2BA9DF',
              '#30C7C4',
              '#6BD5A0',
              '#A7ECB2',
              '#D0F4CA',
            ].reverse(),
          );
        scene.addLayer(layer);
      });
  });
}
