import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

window.onLoad = function() {
  const map = new AMap.Map('map', {
    viewMode: '3D',
    pitch: 0,
    mapStyle: 'amap://styles/darkblue',
    center: [ 121.435159, 31.256971 ],
    zoom: 14.89,
    minZoom: 10
  });
  const scene = new Scene({
    id: 'map',
    map: new GaodeMap({
      mapInstance: map
    })
  });
  scene.on('loaded', () => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json'
    )
      .then(res => res.json())
      .then(data => {
        const pointLayer = new PointLayer()
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude'
            }
          })
          .shape('name', [
            'circle',
            'triangle',
            'square',
            'pentagon',
            'hexagon',
            'octogon',
            'hexagram',
            'rhombus',
            'vesica'
          ])
          .size('unit_price', [ 10, 25 ])
          .color('name', [ '#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452' ])
          .style({
            opacity: 0.3,
            strokeWidth: 2
          });
        scene.addLayer(pointLayer);
      });
  });
};

const url = 'https://webapi.amap.com/maps?v=1.4.15&key=15cd8a57710d40c9b7c0e3cc120f1200&callback=onLoad';
// const url = 'https://webapi.amap.com/maps?v=2.0&key=ff533602d57df6f8ab3b0fea226ae52f&callback=onLoad';
const jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);
