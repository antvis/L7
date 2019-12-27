import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const map = new AMap.Map('container', {
  resizeEnable: true, // 是否监控地图容器尺寸变化
  zoom: 11, // 初始化地图层级
  center: [ 116.397428, 39.90923 ] // 初始化地图中心点
});
new Scene({
  id: 'map',
  map: new GaodeMap({
    mapInstance: map
  })
});
