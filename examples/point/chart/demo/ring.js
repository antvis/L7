import { Scene } from '@antv/l7-scene';
import { Marker } from '@antv/l7-component';
import * as G2 from '@antv/g2';

const CSS = `.l7-marker .g2-guide-html {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  text-align: center;
  line-height: 0.1
}

l7-marker .g2-guide-html .title {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 300;
}

l7-marker .g2-guide-html .value {
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
`;
function loadCssCode(code) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  // for Chrome Firefox Opera Safari
  style.appendChild(document.createTextNode(code));
  // for IE
  // style.styleSheet.cssText = code;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
}
loadCssCode(CSS);

const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'dark',
  center: [ 52.21496184144132, 24.121126851768906 ],
  zoom: 3.802
});
window.mapScene = scene;
scene.on('loaded', () => {
  Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/5b772136-a1f4-4fc5-9a80-9f9974b4b182.json'
    ).then(d => d.json()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/f3c467a4-9ae0-4f08-bb5f-11f9c869b2cb.json'
    ).then(d => d.json())
  ]).then(function onLoad([ center, population ]) {
    const popobj = {};
    population.forEach(element => {
      popobj[element.Code] =
        element['Population, female (% of total) (% of total)'];
    });
    // 数据绑定

    center.features = center.features.map(fe => {
      fe.properties.female = popobj[fe.properties.id] * 1 || 0;
      return fe;
    });
    center.features.forEach(point => {
      const el = document.createElement('div');
      const coord = point.geometry.coordinates;
      const v = point.properties.female * 1;
      if (v < 1 || (v > 46 && v < 54)) { return; }
      const size = 60;
      const data = [
        {
          type: '男性',
          value: 100.0 - v.toFixed(2)
        },
        {
          type: '女性',
          value: v.toFixed(2) * 1
        }
      ];
      const chart = new G2.Chart({
        container: el,
        width: size,
        height: size,
        render: 'svg',
        padding: 0
      });
      chart.source(data);
      chart.legend(false);
      chart.tooltip(false);
      chart.coord('theta', {
        radius: 0.9,
        innerRadius: 0.6
      });
      chart
        .intervalStack()
        .position('value')
        .color('type', [ '#5CCEA1', '#5B8FF9' ])
        .opacity(1);
      chart.render();
      new Marker({ element: el })
        .setLnglat({
          lng: coord[0],
          lat: coord[1]
        })
        .addTo(scene);
    });
  });
});
