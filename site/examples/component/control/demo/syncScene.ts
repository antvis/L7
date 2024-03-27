import { GaodeMap, HeatmapLayer, PointLayer, Scene } from '@antv/l7';
import { isNumber } from 'lodash';

// 通过 Scene 获取到地图引擎类型
function getMapType(scene) {
  const mapVersion = scene.getMapService().version;
  return mapVersion?.includes('MAPBOX') ? 'Mapbox' : 'Gaode';
}

// 根据不同地图引擎类型，设置地图的状态「缩放层级、地图中心点、旋转角、倾角」
const updateSceneStatus = (
  scene,
  status = {
    zoom,
    center,
    pitch,
    rotation,
  },
) => {
  const mapType = getMapType(scene);
  const { zoom, center, pitch, rotation } = status;
  if (mapType === 'Gaode') {
    const map = scene?.map;
    // 高德地图关闭动画效果
    if (center) map.setCenter(center, true);
    if (isNumber(zoom)) map?.setZoom(zoom + 1, true);
    if (isNumber(rotation)) map?.setRotation(360 - rotation, true);
    if (isNumber(pitch)) map?.setPitch(pitch, true);
  } else {
    if (isNumber(zoom)) scene?.setZoom(zoom);
    if (center) scene?.setCenter(center);
    if (isNumber(rotation)) scene.setRotation(rotation);
    if (isNumber(pitch)) scene?.setPitch(pitch);
  }
};

export function syncScene(scenes, options = {}) {
  const { zoomGap = 0, mainIndex = 0 } = options ?? {};
  const listeners = [];
  let handlers = [];

  // 添加地图事件监听
  const listen = (index) => {
    const scene = scenes[index];
    scene.on('mapmove', handlers[index]);
    // Gaode 地图调整倾角和旋转角的事件
    scene.on('dragging', handlers[index]);
    // Mapbox 地图调整倾角和旋转角的事件
    scene.on('rotate', handlers[index]);
    scene.on('zoomchange', handlers[index]);

    return () => {
      scene.off('mapmove', handlers[index]);
      scene.off('dragging', handlers[index]);
      scene.off('zoomchange', handlers[index]);
      scene.off('rotate', handlers[index]);
    };
  };

  const clearListener = () => {
    listeners?.forEach((call) => call());
    listeners.length = 0;
  };

  // 根据指定索引的 scene 同步其他 scene 状态
  const moveScenePosition = (index) => {
    const movedScene = scenes[index];
    const center = movedScene.getCenter();
    const zoom = movedScene.getZoom();
    const rotation = movedScene.getRotation();
    const pitch = movedScene.getPitch();
    /**
     * 根据当前地图是否为主地图，分两种情况
     * 1. 非主地图，则其他非主地图 zoom 设置当前 zoom ，主地图设置为 zoom - zoomGap
     * 2. 主地图，则其他非主地图 zoom 设置为 zoom + zoomGap
     */
    const isMovedMainScene = index === mainIndex;
    scenes.forEach((scene, num) => {
      if (num !== index) {
        // 当前需要同步的状态是不是主地图
        const sceneZoom = isMovedMainScene
          ? zoom + zoomGap
          : num === mainIndex
            ? zoom - zoomGap
            : zoom;
        updateSceneStatus(scene, {
          zoom: sceneZoom,
          center: [center.lng, center.lat],
          rotation,
          pitch,
        });
      }
    });
  };

  const syncHandler = (index) => {
    clearListener();
    moveScenePosition(index);
    initListener();
  };

  function initListener() {
    handlers = scenes.map((value, index) => {
      // 每个地图有自己的状态同步函数
      return syncHandler.bind(null, index);
    });
    scenes.forEach((scene, index) => {
      // 给每个地图绑定监听
      listeners.push(listen(index));
    });
  }

  // 初始化,先将所有地图状态同步。
  scenes.forEach((value, index) => {
    moveScenePosition(index);
  });

  // 添加地图事件监听
  initListener();

  // 返回清除绑定的监听事件函数
  return clearListener;
}

const mapDiv = document.getElementById('map');
if (mapDiv) {
  mapDiv.style.cssText = 'display: flex; height: 700px';
  // 创建第一个新div并设置一些属性或内容
  const newMapDiv1 = document.createElement('div');
  newMapDiv1.style.cssText = 'width: 50%; height: 700px; position: relative; margin-right: 5px;';
  newMapDiv1.id = 'map1'; // 给新div设置id

  // 创建第二个新div并设置一些属性或内容
  const newMapDiv2 = document.createElement('div');
  newMapDiv2.style.cssText = 'width: 50%; height: 700px; position: relative;  margin-left: 5px;';
  newMapDiv2.id = 'map2'; // 给新div设置id

  mapDiv.appendChild(newMapDiv1);
  mapDiv.appendChild(newMapDiv2);

  const scene = new Scene({
    id: 'map1',
    map: new GaodeMap({
      pitch: 0,
      style: 'normal',
      center: [114.07737552216226, 22.542656745583486],
      rotation: 90,
      zoom: 12.47985,
    }),
    // 关闭默认 L7 Logo
    logoVisible: false,
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({})
          .source(data)
          .shape('circle')
          .size('h12', [2, 5])
          .color(
            'h12',
            [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
            ].reverse(),
          );
        scene.addLayer(pointLayer);
      });
  });
  const scene1 = new Scene({
    id: 'map2',
    map: new GaodeMap({
      pitch: 0,
      style: 'normal',
      center: [114.07737552216226, 22.542656745583486],
      rotation: 90,
      zoom: 12.47985,
    }),
    // 关闭默认 L7 Logo
    logoVisible: false,
  });
  scene1.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new HeatmapLayer({})
          .source(data, {
            transforms: [
              {
                type: 'hexagon',
                size: 400,
                field: 'h12',
                method: 'sum',
              },
            ],
          })
          .shape('hexagon')
          .style({
            coverage: 0.9,
            angle: 0,
          })

          .color(
            'sum',
            [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
            ].reverse(),
          );
        scene1.addLayer(pointLayer);
      });
  });

  syncScene([scene, scene1]);
}
