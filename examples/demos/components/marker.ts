import { Marker, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 3,
    }),
  });

  scene.on('loaded', () => {
    addMarkers();
    scene.render();
    setTimeout(() => {
      scene.setZoom(5);
    }, 2000);
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
}
