import { Scene } from '@antv/l7-scene';
import { Marker, Popup } from '@antv/l7-component'
import * as G2 from '@antv/g2'
const scene = new Scene({
  id: 'map',
  type: 'amap',
  style: 'light',
  center: [2.6125016864608597,49.359131],
  pitch: 0,
  zoom: 4.19
});

scene.on('loaded',()=>{
  addChart();
})
window.mapScene = scene;
function addChart() {
  fetch('https://gw.alipayobjects.com/os/basement_prod/0b96cca4-7e83-449a-93d0-2a77053e74ab.json')
  .then((res) => res.json())
  .then((data) => {
    data.nodes.forEach(function (item) {
      const el = document.createElement('div');
      const total = item.gdp.Agriculture + item.gdp.Industry + item.gdp.Service;

      const size = Math.min(parseInt(total / 30000), 70);
      if(size< 30) {
        return
      }
      const itemData = [{
        item: 'Agriculture',
        count: item.gdp.Agriculture,
        percent: item.gdp.Agriculture / total
      }, {
        item: 'Industry',
        count: item.gdp.Industry,
        percent: item.gdp.Industry / total
      }, {
        item: 'Service',
        count: item.gdp.Service,
        percent: item.gdp.Service / total
      }];

      var sliceNumber = 0.02;

      // 自定义 other 的图形，增加两条线
      G2.Shape.registerShape('interval', 'sliceShape', {
        draw: function draw(cfg, container) {
          var points = cfg.points;
          var path = [];
          path.push(['M', points[0].x, points[0].y]);
          path.push(['L', points[1].x, points[1].y - sliceNumber]);
          path.push(['L', points[2].x, points[2].y - sliceNumber]);
          path.push(['L', points[3].x, points[3].y]);
          path.push('Z');
          path = this.parsePath(path);
          return container.addShape('path', {
            attrs: {
              fill: cfg.color,
              path: path
            }
          });
        }
      });

      var chart = new G2.Chart({
        container: el,
        width: size,
        height: size,
        render: 'svg',
        padding: 0,
      });
      chart.legend(false);
      chart.source(itemData);
      chart.coord('theta', {
        innerRadius: 0.6
      });
      chart.tooltip(false);
      chart.intervalStack().position('percent').color('item',['#5CCEA1','#5D7092','#5B8FF9']).shape('sliceShape');
      chart.render();
      new Marker({
        element: el
      }).setLnglat({
        lng:item.coordinates[0],
        lat:item.coordinates[1]
      }).addTo(scene);
    });

  });

}

