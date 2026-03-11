import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Three.js 3D 建筑物效果
 * 使用多边形数据创建立体建筑物
 */
export const threeBuildings: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    // Three.js r163+ 需要 WebGL2，必须使用 'device' 渲染器
    renderer: 'device',
    mapConfig: {
      style: 'dark',
      // 数据位于深圳区域
      center: [113.95, 22.535],
      zoom: 12,
      pitch: 60,
      rotation: 0,
    },
  });

  scene.registerRenderService(ThreeRender);

  // 加载建筑物数据
  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/972566c5-a2b9-4a7e-8da1-bae9d0eb0117.json',
  ).then((res) => res.json());

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 环境光照
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.3));

      // 方向光（模拟阳光）
      const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
      sunLight.position.set(100, 200, 100);
      sunLight.castShadow = true;
      threeScene.add(sunLight);

      // 蓝色补光
      const fillLight = new THREE.DirectionalLight(0x049ef4, 0.3);
      fillLight.position.set(-100, 50, -100);
      threeScene.add(fillLight);

      // 处理建筑物数据
      const features = data.features || [];

      features.forEach((feature: any) => {
        // h20 是活动密度值（0~12），applyObjectLngLat 的 altitude 单位为米
        // rawValue * 50 → 高度范围 50~600m，与城市建筑物尺度匹配
        const rawValue = feature.properties?.h20 || 1;
        const height = Math.max(rawValue * 10, 10);
        const geometryType = feature.geometry?.type;
        // 兼容 Polygon 和 MultiPolygon
        const polygons: number[][][][] =
          geometryType === 'MultiPolygon'
            ? feature.geometry.coordinates
            : [feature.geometry.coordinates];

        polygons.forEach((polygonCoords: number[][][]) => {
          const outerRing = polygonCoords[0];
          if (!outerRing || outerRing.length < 3) return;

          const color = getBuildingColor(rawValue);
          const buildingMesh = createBuildingBox(outerRing, height, color);
          if (!buildingMesh) return;

          const center = getRingCenter(outerRing);
          if (!center) return;

          // applyObjectLngLat 正确处理默认地图和高德地图的坐标换算
          // altitude = height/2 使建筑物底面贴地，顶面在 height 处
          layer.applyObjectLngLat(buildingMesh, center, height / 2);
          threeScene.add(buildingMesh);
        });
      });
    },
  }).animate(false);

  scene.addLayer(threeJSLayer);

  // 地图交互时触发重绘，避免持续动画循环导致卡顿
  scene.on('mapMove', () => scene.render());
  scene.on('zoomChange', () => scene.render());
  scene.on('rotateChange', () => scene.render());
  scene.on('pitchChange', () => scene.render());

  return scene;
};

/**
 * 从多边形外环顶点创建立柱（Mesh）
 * - outerRing: 经纬度坐标点数组（单个环）
 * - height: 柱子高度（米），将通过 applyObjectLngLat 的 altitude 参数正确映射
 */
function createBuildingBox(
  outerRing: number[][],
  height: number,
  color: number,
): THREE.Mesh | null {
  if (!outerRing || outerRing.length < 3) return null;

  // 计算多边形边界框
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  outerRing.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  // 将经纬度差值粗略转换为米（applyObjectLngLat 的本地坐标系单位是米）
  const width = Math.max((maxX - minX) * 100000, 20);
  const depth = Math.max((maxY - minY) * 100000, 20);

  // BoxGeometry(width, height_local, depth)：Three.js 默认 Y 轴为高度方向
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshPhongMaterial({ color, flatShading: false });
  const mesh = new THREE.Mesh(geometry, material);

  // 绕 X 轴旋转 90°：将 Three.js 本地 Y 轴（高度）映射到地图的 Z 轴（altitude 方向）
  // 与 CylinderGeometry 的处理方式一致
  mesh.rotation.x = Math.PI / 2;

  return mesh;
}

/**
 * 根据活动密度值返回颜色
 */
function getBuildingColor(value: number): number {
  if (value >= 10) return 0xff3366;
  if (value >= 8) return 0xff6633;
  if (value >= 6) return 0xffcc33;
  if (value >= 4) return 0x33cc66;
  if (value >= 2) return 0x3366ff;
  return 0x444466;
}

/**
 * 计算外环中心点
 */
function getRingCenter(outerRing: number[][]): [number, number] | null {
  if (!outerRing || outerRing.length === 0) return null;
  let sumX = 0,
    sumY = 0;
  outerRing.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
  });
  return [sumX / outerRing.length, sumY / outerRing.length];
}
