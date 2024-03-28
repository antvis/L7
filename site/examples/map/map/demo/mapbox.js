import { PointLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

function initMap() {
  const scene = new Scene({
    id: 'map',
    map: new Mapbox({
      zoom: 10,
      minZoom: 0,
      maxZoom: 18,
      token:
        'pk.eyJ1Ijoic2tvcm5vdXMiLCJhIjoiY2s4dDBkNjY1MG13ZTNzcWEyZDYycGkzMyJ9.tjfwvJ8G_VDmXoClOyxufg',
    }),
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({
          autoFit: true,
        })
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
            opacity: 1,
            strokeWidth: 2,
          });
        scene.addLayer(pointLayer);
      });
  });
}
initMap();
