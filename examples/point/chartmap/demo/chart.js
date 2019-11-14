import { Scene } from '@l7/scene';
import { Marker } from '@l7/component'
import G2Plot from '@antv/g2plot'
const scene = new Scene({
  id: 'map',
  type: 'amap',
  style: 'light',
  center: [-122.80009283836715, 37.05881309947238],
  pitch: 0,
  zoom: 5
});

// fetch('https://gw.alipayobjects.com/os/basement_prod/0b96cca4-7e83-449a-93d0-2a77053e74ab.json')
//   .then((res) => res.text())
//   .then((data) => {
//     data.nodes.forEach(function (item) {
//       const el = document.createElement('div');
//       const total = item.gdp.Agriculture + item.gdp.Industry + item.gdp.Service;

//       const size = Math.max(Math.min(parseInt(total / 20000), 150), 30);
//       const itemData = [{
//         item: 'Agriculture',
//         count: item.gdp.Agriculture,
//         percent: item.gdp.Agriculture / total
//       }, {
//         item: 'Industry',
//         count: item.gdp.Industry,
//         percent: item.gdp.Industry / total
//       }, {
//         item: 'Service',
//         count: item.gdp.Service,
//         percent: item.gdp.Service / total
//       }];

//       const config = {
//         "title": {
//           "visible": false,
//           "text": "环图",
//           "style": {
//             "fill": "rgba(0, 0, 0, 0.85)"
//           }
//         },
//         "description": {
//           "visible": false,
//           "text": "一个简单的环图",
//           "style": {
//             "fill": "rgba(0, 0, 0, 0.85)",
//             "bottom_margin": 10
//           }
//         },
//         "padding": "auto",
//         "legend": {
//           "visible": false,
//           "position": "top-left"
//         },
//         "tooltip": {
//           "visible": false,
//           "shared": false,
//           "crosshairs": null
//         },
//         "xAxis": {
//           "visible": true,
//           "autoHideLabel": false,
//           "autoRotateLabel": false,
//           "autoRotateTitle": false,
//           "grid": {
//             "visible": false
//           },
//           "line": {
//             "visible": false
//           },
//           "tickLine": {
//             "visible": true
//           },
//           "label": {
//             "visible": true
//           },
//           "title": {
//             "visible": false,
//             "offset": 12
//           }
//         },
//         "yAxis": {
//           "visible": true,
//           "autoHideLabel": false,
//           "autoRotateLabel": false,
//           "autoRotateTitle": true,
//           "grid": {
//             "visible": true
//           },
//           "line": {
//             "visible": false
//           },
//           "tickLine": {
//             "visible": false
//           },
//           "label": {
//             "visible": true
//           },
//           "title": {
//             "visible": false,
//             "offset": 12
//           }
//         },
//         "label": {
//           "visible": true,
//           "type": "outer",
//           "style": {
//             "fill": "rgba(0, 0, 0, 0.65)"
//           }
//         },
//         "width": 317,
//         "height": 249,
//         "forceFit": false,
//         "radius": 1,
//         "pieStyle": {
//           "stroke": "white",
//           "lineWidth": 1
//         },
//         "innerRadius": 0.74,
//         "animation": false,
//         "colorField": "x",
//         "angleField": "y",
//         "color": null
//       }
//       const plot = new G2Plot.Ring(el, {
//         data: itemData,
//         ...config,
//       });
//       plot.render();
//       var popup = new L7.Popup({
//         anchor: 'left'
//       }).setText(item.name);
//       new Marker({
//         element: el
//       }).setLnglat(item.coordinates).setPopup(popup).addTo(scene);
//     });

//   });
