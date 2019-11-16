import { Scene } from '@l7/scene';
import { Marker, Popup } from '@l7/component'
import * as G2 from '@antv/g2'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'dark',
  center: [0, 29.877025],
  zoom: 0,
});

scene.on('loaded', () => {
  new Marker().setLnglat({
    lng: 112,
    lat: 30
  }).addTo(scene);
  Promise.all([
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json').then(d => d.json()),
    fetch('https://gw.alipayobjects.com/os/basement_prod/5b772136-a1f4-4fc5-9a80-9f9974b4b182.json').then(d => d.json()),
    fetch('https://gw.alipayobjects.com/os/basement_prod/f3c467a4-9ae0-4f08-bb5f-11f9c869b2cb.json').then(d => d.json())
  ]).then(function onLoad([world, center, population]) {

    const popobj = {};
    population.forEach(element => {
      popobj[element.Code] = element['Population, female (% of total) (% of total)']
    });
    // 数据绑定

    center.features = center.features.map((fe) => {
      fe.properties.female = popobj[fe.properties.id] * 1 || 0;
      return fe;
    })
    center.features.forEach((point, index) => {
      const el = document.createElement('div');
      const coord = point.geometry.coordinates;
      const v = point.properties.female * 1;
      if (v < 1 || v> 46 && v < 54) return;
      const size = 70;
      const data = [{
        type: '男性',
        value: 100.00 - v.toFixed(2)
      }, {
        type: '女性',
        value: v.toFixed(2) * 1
      }];
      const chart = new G2.Chart({
        container: el,
        width: size,
        height: size,
        render: 'canvas',
        padding: 0
      });
      chart.source(data);
      chart.legend(false);
      chart.tooltip(false);
      chart.coord('theta', {
        radius: 0.9,
        innerRadius: 0.75
      });
      chart.guide().html({
        position: ['50%', '50%'],
        html: '<div class="g2-guide-html"><p class="title">' + data[1].type + '</p><p class="value">' + (data[1].value + '%') + '</p></div>'
      });
      console.log(data);
      chart.intervalStack().position('value').color('type', ['#eceef1', '#f0657d',]).opacity(1);
      chart.render();
      new Marker().setLnglat({
        lng: coord[0],
        lat: coord[1]
      }).addTo(scene);
    })

  });
})
