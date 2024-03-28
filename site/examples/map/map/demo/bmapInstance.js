import { PointLayer, Scene } from '@antv/l7';
import { BaiduMap } from '@antv/l7-maps';

function initMap() {
  // 全局加载百度地图API
  // eslint-disable-next-line no-undef
  const map = new BMapGL.Map('map', {
    minZoom: 5,
    maxZoom: 18,
  });
  // 百度地图需要执行centerAndZoom进行初始化
  // eslint-disable-next-line no-undef
  map.centerAndZoom(new BMapGL.Point(110.435159, 31.256971), 6);
  // 默认滚轮缩放禁用，需要如下执行开启
  map.enableScrollWheelZoom();
  map.setMapStyleV2({
    styleId: '344b005fd5b4220a55241c25e7733e81',
  });

  const scene = new Scene({
    id: 'map',
    map: new BaiduMap({
      mapInstance: map,
    }),
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({
          autoFit: true,
        })
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
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
            'vesica',
          ])
          .size('unit_price', [10, 25])
          .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
          .style({
            opacity: 0.3,
            strokeWidth: 2,
          });
        scene.addLayer(pointLayer);
      });
  });
}
initMap();
