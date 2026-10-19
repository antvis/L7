import { PointLayer, Scene } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';

function initMap() {
  const scene = new Scene({
    id: 'map',
    map: new TencentMap({
      zoom: 10,
      minZoom: 5,
      maxZoom: 18,
    }),
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer()
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .shape('name', [
            'circle',
            'triangle',
            'square',
            'pentagon',
            'hexagon',
            'octogon',
            'hexagram',
            'rhombus',
            'vesica',
          ])
          .size('unit_price', [10, 25])
          .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
          .style({
            opacity: 0.3,
            strokeWidth: 2,
          });
        scene.addLayer(pointLayer);
      });
  });
}
initMap();
