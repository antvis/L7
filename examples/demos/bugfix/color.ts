import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
  map: string;
  renderer: 'regl' | 'device';
}) {
  const scene = new Scene({
    id: 'map',
    // renderer: option.renderer,
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [-96, 37.8],
      zoom: 3,
    }),
  });
  scene.on('loaded', () => {
    fetch(
      // 'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
      'https://mdn.alipayobjects.com/afts/file/A*CFbnRqXpg8wAAAAAAAAAAAAADrd2AQ/test.json',
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const layer = new PolygonLayer({ autoFit: true })
          .source(data)
          .color('#f00')
          .shape('fill')
          .active(true);
        const layer2 = new LineLayer({
          zIndex: 2,
        })
          .source(data)
          .color('#ffffff')
          .active(true)
          .size(1)
          .style({
            lineType: 'dash',
            dashArray: [2, 2],
          });
        scene.addLayer(layer);
        scene.addLayer(layer2);

        setTimeout(() => {
          layer.color('#f0f');
          layer2.color('#00f');
          scene.render();
        }, 1000);
      });
  });
}
