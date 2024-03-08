import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import { sleep } from '../../utils/sleep';

export function MapRender(option: {
  map: string;
  renderer: 'regl' | 'device';
}) {
  const scene = new Scene({
    id: 'map',
    // renderer: option.renderer,
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [116.368652, 39.93866],
      zoom: 10.07,
    }),
  });
  scene.on('loaded', () => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/1d27c363-af3a-469e-ab5b-7a7e1ce4f311.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new PolygonLayer({
          autoFit: true,
        })
          .source(data)
          .color(
            'unit_price',
            [
              '#1A4397',
              '#2555B7',
              '#3165D1',
              '#467BE8',
              '#6296FE',
              '#7EA6F9',
              '#98B7F7',
              '#BDD0F8',
              '#DDE6F7',
              '#F2F5FC',
            ].reverse(),
          )
          .shape('fill')
          .active(true);

        scene.addLayer(layer);

        layer.on('legend:color', (color) => {
          console.log('color legend', layer.getLegend('color'));
        });

        sleep(2000)
          .then(() => {
            console.log('update data');
            const newData = {
              ...data,
              features: data.features.slice(1, 10),
            };
            layer.setData(newData);
          })
          .then(() => sleep(2000))
          .then(() => {
            console.log('update color');
            layer.color('unit_price', [
              '#1A4397',
              '#2555B7',
              '#3165D1',
              '#467BE8',
              '#6296FE',
              '#7EA6F9',
              '#98B7F7',
              '#BDD0F8',
              '#DDE6F7',
              '#F2F5FC',
            ]);
            scene.render();
          });
      });
  });
}
