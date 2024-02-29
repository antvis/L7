/*
 * @name         : 地图状态同步方法
 * @Description  : 用于将多个地图动作、视角同步
 * @Principle    : 监听所有地图场景的 mapmove、zoomchange、rotate 等事件。触发时，解绑自己事件 => 同步所有的地图状态 => 重新添加监听
 */

import type { Scene } from '@antv/l7';
import { isNumber } from 'lodash-es';
import type { ISyncSceneOptions } from './types';
interface GaodeMap {
  setCenter: (center: [number, number], immediately?: boolean) => void;
  setZoom: (zoom: number, immediately?: boolean) => void;
  setRotation: (rotation: number, immediately?: boolean) => void;
  setPitch: (pitch: number, immediately?: boolean) => void;
}

// 通过 Scene 获取到地图引擎类型
function getMapType(scene: Scene) {
  const mapVersion = scene.getMapService().version;
  return mapVersion?.includes('MAPBOX') ? 'Mapbox' : 'Gaode';
}

// 根据不同地图引擎类型，设置地图的状态「缩放层级、地图中心点、旋转角、倾角」
const updateSceneStatus = (
  scene: Scene,
  status: {
    zoom?: number;
    center?: [number, number];
    pitch?: number;
    rotation?: number;
  },
) => {
  const mapType = getMapType(scene);
  const { zoom, center, pitch, rotation } = status;
  if (mapType === 'Gaode') {
    const map = scene?.map as GaodeMap;
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

/**
 *
 * @param scenes l7实例化的 scene 的数组
 * @param options
 * @param options.zoomGap number  同步的缩放层级差距
 * @param options.mainIndex number  主场景的数组索引，用于搭配 zoomGap
 * @returns Function  清除同步状态的监听函数。
 */
export function syncScene(scenes: Scene[], options?: ISyncSceneOptions) {
  const { zoomGap = 0, mainIndex = 0 } = options ?? {};
  const listeners: (() => void)[] = [];
  let handlers: (() => void)[] = [];

  // 添加地图事件监听
  const listen = (index: number) => {
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
    listeners?.forEach((call: any) => call());
    listeners.length = 0;
  };

  // 根据指定索引的 scene 同步其他 scene 状态
  const moveScenePosition = (index: number) => {
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
        const sceneZoom = isMovedMainScene ? zoom + zoomGap : num === mainIndex ? zoom - zoomGap : zoom;
        updateSceneStatus(scene, {
          zoom: sceneZoom,
          center: [center.lng, center.lat],
          rotation,
          pitch,
        });
      }
    });
  };

  /**
   * 地图同步处理器
   * 1. 清空监听
   * 2. 同步指定地图状态
   * 3. 重新初始化地图监听
   * @param index
   */
  const syncHandler = (index: number) => {
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
