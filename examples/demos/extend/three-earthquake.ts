import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Three.js 地震数据 3D 可视化
 * 使用地震震级数据创建 3D 柱状图
 */
export const threeEarthquake: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    // Three.js r163+ 需要 WebGL2，必须使用 'device' 渲染器
    renderer: 'device',
    mapConfig: {
      style: 'dark',
      center: [-120, 37],
      zoom: 5,
      pitch: 45,
      rotation: 0,
    },
  });

  scene.registerRenderService(ThreeRender);

  // 加载地震数据
  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
  ).then((res) => res.json());

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 环境光照
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.4));

      // 方向光
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(100, 100, 100);
      threeScene.add(dirLight);

      // 点光源
      const pointLight = new THREE.PointLight(0x049ef4, 1, 1000);
      pointLight.position.set(0, 100, 0);
      threeScene.add(pointLight);

      // 根据震级创建不同高度的柱状体
      const features = data.features || [];
      features.forEach((feature: any) => {
        const { mag, coordinates } = parseFeature(feature);
        if (!coordinates) return;

        const [lng, lat, depth = 0] = coordinates;

        // 根据震级计算柱子高度和颜色
        const height = Math.max(mag * 10000, 5000);
        const color = getMagColor(mag);

        // 创建圆柱体
        const geometry = new THREE.CylinderGeometry(mag * 500, mag * 500, height, 16);
        const material = new THREE.MeshPhongMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.85,
        });

        const cylinder = new THREE.Mesh(geometry, material);

        // CylinderGeometry 默认沿 Y 轴，旋转 90° 使其沿 Z 轴（高度/海拔方向）竖立
        cylinder.rotation.x = Math.PI / 2;

        // applyObjectLngLat 正确处理不同地图的坐标系：
        //   - 默认/Mapbox 地图：将坐标转为相对于场景中心的 mercator 单位，避免 setObjectLngLat 的双重偏移问题
        //   - 高德地图：效果等同于 setObjectLngLat（AMap 使用绝对投影坐标）
        layer.applyObjectLngLat(cylinder, [lng, lat], height / 2);

        // 添加用户数据用于交互
        cylinder.userData = {
          mag,
          depth,
          lng,
          lat,
        };

        threeScene.add(cylinder);

        // 添加发光效果的外圈
        const glowGeometry = new THREE.CylinderGeometry(mag * 800, mag * 800, height * 0.1, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = Math.PI / 2;
        layer.applyObjectLngLat(glow, [lng, lat], 0);
        threeScene.add(glow);
      });
    },
  }).animate(true);

  scene.addLayer(threeJSLayer);

  return scene;
};

/**
 * 解析 GeoJSON Feature
 */
function parseFeature(feature: any): { mag: number; coordinates: number[] | null } {
  const mag = feature.properties?.mag || 1;
  const coordinates = feature.geometry?.coordinates;
  return { mag, coordinates };
}

/**
 * 根据震级返回颜色
 */
function getMagColor(mag: number): number {
  if (mag >= 5) return 0xff0000; // 红色 - 强震
  if (mag >= 4) return 0xff6600; // 橙色
  if (mag >= 3) return 0xffcc00; // 黄色
  if (mag >= 2) return 0x00ff00; // 绿色
  return 0x049ef4; // 蓝色 - 微震
}
