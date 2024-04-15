import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import { featureEach, interpolate, randomPoint } from '@turf/turf';
import type { RenderDemoOptions } from '../../types';

const points = randomPoint(30, { bbox: [120.103217, 30.26128, 120.10348, 30.261506] });

featureEach(points, function (point) {
  // add a random property to each point
  point.properties.solRad = Math.random() * 50;
});

const GEO_DATA = interpolate(points, 0.001, {
  gridType: 'point',
  property: 'solRad',
  units: 'miles',
});

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'normal',
      center: [121.434765, 31.256735],
      zoom: 14.83,
      maxZoom: 23,
    }),
  });

  const layer = new PointLayer({ autoFit: true })
    .source(GEO_DATA)
    .size(10)
    .color('#f00')
    .shape('simple');

  scene.on('loaded', () => {
    scene.addLayer(layer);
  });
}
