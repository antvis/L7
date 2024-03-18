import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 96.99215001469588, 29.281597225674773 ],
    zoom: 2.194613775109773,
    maxZoom: 10
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json'
  )
    .then(res => res.json())
    .then(data => {
      data.features = data.features.filter(item => {
        return item.properties.capacity > 800;
      });
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('circle')
        .size('capacity', [ 0, 16 ])
        .color('capacity', [
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ])
        .active(true)
        .style({
          opacity: 0.5,
          strokeWidth: 0
        });

      scene.addLayer(pointLayer);
    });
});
