import { ArcLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'dark',
  center: [102.602992, 23.107329],
  zoom: 0,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/b83699f9-a96d-49b8-b2ea-f99299faebaf.json')
  .then((res) => res.json())
  .then((data) => {

    function getAirportCoord(idx) {
      return [data.airports[idx][3], data.airports[idx][4]];
    }
    const routes = data.routes.map(function (airline) {
      return {
        coord: [
          getAirportCoord(airline[1]),
          getAirportCoord(airline[2])
        ]
      }
    });

    const layer =
      new ArcLineLayer({})
        .source(routes, {
          parser: {
            type: 'json',
            coordinates: 'coord',
          },
        })
        .size(0.6)
        .shape('arc')
        .color('rgb(5, 5, 50)')
        .style({
          opacity: 0.05,
        })
      ;
    scene.addLayer(layer);
  })
