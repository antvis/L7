import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const mutiPolygon: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const geoData = await fetch(
    'https://npm.elemecdn.com/static-geo-atlas/geo-data/choropleth-data/country/100000_country_province.json',
  )
    .then((res) => res.json())
    .then((data) => data.features.slice(4, 5));

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

  return scene;
};
