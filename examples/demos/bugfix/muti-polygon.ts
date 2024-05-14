import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'dark',
      center: [-96, 37.8],
      zoom: 3,
    }),
  });

  fetch(
    'https://npm.elemecdn.com/static-geo-atlas/geo-data/choropleth-data/country/100000_country_province.json',
  )
    .then((res) => res.json())
    .then((data) => data.features.slice(4, 5))
    .then((geoData) => {
      const layer = new PolygonLayer({
        autoFit: true,
      })
        .source(geoData, {
          parser: {
            type: 'json',
            geometry: 'geometry',
          },
        })
        .color('rgb(22,199,255)')
        .shape('fill')
        // .shape('extrude')
        // .size(1200 * 100)
        .active(true)
        .style({
          opacity: 0.5,
        });

      scene.addLayer(layer);
    });
}
