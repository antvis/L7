import { Marker, MarkerLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [105.790327, 30],
    zoom: 2,
  }),
});
scene.on('loaded', () => {
  addMarkers();
  scene.render();
});
function addMarkers() {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((nodes) => {
      const markerLayer = new MarkerLayer({
        cluster: true,
      });
      for (let i = 0; i < nodes.features.length; i++) {
        const { coordinates } = nodes.features[i].geometry;
        const marker = new Marker().setLnglat({
          lng: coordinates[0],
          lat: coordinates[1],
        });
        markerLayer.addMarker(marker);
      }
      scene.addMarkerLayer(markerLayer);
    });
}
