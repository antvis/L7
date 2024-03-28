import { Scene } from '@antv/l7';
import { BaiduMap } from '@antv/l7-maps';

new Scene({
  id: 'map',
  map: new BaiduMap({
    center: [107.054293, 35.246265],
    zoom: 4.056,
    style: 'c17b1c2b528429a7b04bbc8d3eb8bae9',
    // 百度地图的logo是否可见，默认true
    logoVisible: false,
  }),
});
