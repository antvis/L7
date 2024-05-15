import { Popup, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap.GaodeMap({
      style: 'light',
      center: [121.435159, 31.256971],
      zoom: 14.89,
      minZoom: 10,
    }),
  });
  scene.on('loaded', () => {
    const popup = new Popup({
      lngLat: {
        lng: 121.435159,
        lat: 31.256971,
      },
      html: '<div>123456</div>',
      className: String(Math.random()),
      style: `z-index: ${String(Math.random())}`,
    });

    setInterval(() => {
      popup.setOptions({
        className: String(Math.random()),
        style: `z-index: ${String(Math.floor(Math.random() * 100))}`,
      });
    }, 2000);

    scene.addPopup(popup);
  });
}
