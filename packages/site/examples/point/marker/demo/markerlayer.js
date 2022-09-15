import { Scene, Marker, MarkerLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 105.790327, 36.495636 ],
    zoom: 4
  })
});
scene.on('loaded', () => {
  addMarkers();
  scene.render();
});
function addMarkers() {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json'
  )
    .then(res => res.json())
    .then(nodes => {
      const markerLayer = new MarkerLayer();
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].g !== '1' || nodes[i].v === '') {
          continue;
        }
        const el = document.createElement('label');
        el.className = 'labelclass';
        el.textContent = nodes[i].v + '℃';
        el.style.background = getColor(nodes[i].v);
        el.style.borderColor = getColor(nodes[i].v);
        const marker = new Marker({
          element: el
        }).setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });
        markerLayer.addMarker(marker);
      }
      scene.addMarkerLayer(markerLayer);
    });
}

function getColor(v) {
  const colors = [ '#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32' ];
  return v > 50
    ? colors[7]
    : v > 40
      ? colors[6]
      : v > 30
        ? colors[5]
        : v > 20
          ? colors[4]
          : v > 10
            ? colors[3]
            : v > 5
              ? colors[2]
              : v > 0
                ? colors[1]
                : colors[0];
}
