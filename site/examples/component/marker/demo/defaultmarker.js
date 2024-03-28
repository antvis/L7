import { Marker, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [105.790327, 36.495636],
    zoom: 4,
  }),
});
scene.on('loaded', () => {
  addMarkers();
  scene.render();
});
function addMarkers() {
  fetch('https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json')
    .then((res) => res.json())
    .then((nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].g !== '1' || nodes[i].v === '') {
          continue;
        }

        const marker = new Marker().setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });
        scene.addMarker(marker);
      }
    });
}
