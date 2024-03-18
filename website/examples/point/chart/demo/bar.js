import { Scene, Marker } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as G2 from '@antv/g2';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [2.6125016864608597, 49.359131],
    zoom: 4.19,
  }),
});
scene.on('loaded', () => {
  addChart();
  scene.render();
});
function addChart() {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/0b96cca4-7e83-449a-93d0-2a77053e74ab.json',
  )
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach(function (item) {
        const el = document.createElement('div');
        const total =
          item.gdp.Agriculture + item.gdp.Industry + item.gdp.Service;

        const size = Math.min(parseInt(total / 30000, 10), 70);
        if (size < 30) {
          return;
        }
        const itemData = [
          {
            item: 'Agriculture',
            count: item.gdp.Agriculture,
            percent: item.gdp.Agriculture / total,
          },
          {
            item: 'Industry',
            count: item.gdp.Industry,
            percent: item.gdp.Industry / total,
          },
          {
            item: 'Service',
            count: item.gdp.Service,
            percent: item.gdp.Service / total,
          },
        ];

        const chart = new G2.Chart({
          container: el,
          width: size,
          height: size,
          render: 'svg',
          padding: 0,
        });
        chart.legend(false);
        chart.data(itemData);
        chart.tooltip(false);

        chart.axis('count', false);
        chart.axis('item', false);
        chart
          .interval()
          .position('item*count')
          .color('item', ['#5CCEA1', '#5D7092', '#5B8FF9']);
        chart.render();
        const marker = new Marker({
          element: el,
        }).setLnglat({
          lng: item.coordinates[0],
          lat: item.coordinates[1],
        });
        scene.addMarker(marker);
      });
    });
}
