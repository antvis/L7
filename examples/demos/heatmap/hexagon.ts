import { HeatmapLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
  map: string;
  renderer: 'regl' | 'device';
}) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer,
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });

  scene.on('loaded', () => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new HeatmapLayer({ autoFit: true })
          .source(data, {
            transforms: [
              {
                type: 'hexagon',
                size: 100,
                field: 'h12',
                method: 'sum',
              },
            ],
          })
          .size('sum', [0, 60])
          .shape('squareColumn')
          .style({
            opacity: 1,
          })
          .active(true)
          .color(
            'sum',
            [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#CEF8D6',
            ].reverse(),
          );
        scene.startAnimate();
        scene.addLayer(layer);
        scene.render();
      });
  });
}
