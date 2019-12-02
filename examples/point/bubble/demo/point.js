import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    type: 'amap',
    style: 'light',
    center: [140.067171, 36.26186],
    zoom: 5.32,
    maxZoom: 10,
  }),
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
)
  .then((res) => res.json())
  .then((data) => {
    const pointLayer = new PointLayer({})
      .source(data)
      .shape('circle')
      .size('mag', [1, 25])
      .color('mag', (mag) => {
        return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
      })
      .style({
        opacity: 0.3,
        strokeWidth: 1,
      });

    scene.addLayer(pointLayer);
  });
