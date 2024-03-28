// @ts-ignore
import { PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [121.268, 30.3628],
    pitch: 0,
    zoom: 4,
  }),
});

fetch('https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json')
  .then((d) => d.json())
  .then((data) => {
    const source = new Source(data, {
      parser: {
        type: 'geojsonvt',
        tileSize: 256,
        zoomOffset: 0,
        maxZoom: 9,
        // extent: [-180, -85.051129, 179, 85.051129],
      },
    });

    const polygon = new PolygonLayer({
      featureId: 'COLOR',
    })
      .source(source)
      .color('COLOR')
      .shape('fill')
      // .active(true)
      // .select(true)
      .style({
        opacity: 0.6,
      });
    scene.addLayer(polygon);
  });
