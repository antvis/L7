import { Scene } from '@l7/scene';
import { Marker, Popup } from '@l7/component'
import  * as G2Plot from '@antv/g2plot'
const scene = new Scene({
  id: 'map',

  type: 'amap',
  style: 'light',
  center: [122.80009283836715, 37.05881309947238],
  pitch: 0,
  zoom: 3
});

scene.on('loaded',()=>{
  addChart();
})
function addChart() {
  fetch('https://gw.alipayobjects.com/os/basement_prod/0b96cca4-7e83-449a-93d0-2a77053e74ab.json')
  .then((res) => res.json())
  .then((data) => {
    data.nodes.forEach(function (item) {
      const el = document.createElement('div');
      const total = item.gdp.Agriculture + item.gdp.Industry + item.gdp.Service;

      const size = Math.max(Math.min(parseInt(total / 20000), 100), 30);
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

      const config = {
        "tooltip": {
          "visible": true,
          "shared": false,
          "crosshairs": null
        },
        legend:{
          "visible": false,
        },
        "label": {
          "visible": false,
          "type": "outer",
          "style": {
            "fill": "rgba(0, 0, 0, 0.65)"
          }
        },
        "width": size,
        "height": size,
        "forceFit": false,
        "radius": 1,
        "pieStyle": {
          "stroke": "white",
          "lineWidth": 1
        },
        "innerRadius": 0.64,
        "animation": false,
        "colorField": "item",
        "angleField": "percent", 
        "color": ["#5CCEA1", "#5D7092", "#5B8FF9"]
      }
      const plot = new G2Plot.Ring(el, {
        data: itemData,
        ...config,
      });
      plot.render();
      new Marker({
        element: el
      }).setLnglat({
        lng:item.coordinates[0],
        lat:item.coordinates[1]
      }).addTo(scene);
    });

  });

}

