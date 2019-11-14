import { HeatMapGridLayer, HeatMapGrid3dLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 0,
  center: [114.0500, 22.5441],
  zoom: 14,
  type: 'mapbox',
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
)
  .then((res) => res.json())
  .then((data) => {
    const layer = new HeatMapGrid3dLayer({})
      .source(data, {
        transforms: [
          {
            type: 'hexagon',
            size: 200,
            field: 'h12',
            method: 'sum',
          },
        ],
      })
      .size('sum', [0, 600])
      .shape('hexagon')
      .style({
        coverage: 0.8,
        angle: 0,
        opacity: 1.0,
      })
      .color(
        'sum',
        [
          '#ffffcc',
          '#ffeda0',
          '#fed976',
          '#feb24c',
          '#fd8d3c',
          '#fc4e2a',
          '#e31a1c',
          '#bd0026',
          '#800026',
        ].reverse(),
      );
    scene.addLayer(layer);
  });
