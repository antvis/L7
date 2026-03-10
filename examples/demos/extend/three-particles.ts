import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Three.js 粒子系统演示
 * 使用粒子效果展示城市分布
 */
export const threeParticles: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    // Three.js r163+ 需要 WebGL2，必须使用 'device' 渲染器
    renderer: 'device',
    mapConfig: {
      style: 'dark',
      center: [112, 28],
      zoom: 6,
      pitch: 50,
      rotation: 0,
    },
  });

  scene.registerRenderService(ThreeRender);

  // 加载城市数据
  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json',
  ).then((res) => res.json());

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 环境光
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.5));

      // 点光源
      const pointLight = new THREE.PointLight(0x049ef4, 2, 1000000);
      pointLight.position.set(0, 500000, 0);
      threeScene.add(pointLight);

      // 创建粒子系统
      // 预先筛选坐标有效的 features，避免 BufferGeometry 中出现 NaN/零坐标粒子
      const validFeatures = (data.features || [])
        .filter((f: any) => {
          const [lng, lat] = f.geometry?.coordinates || [];
          return typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat);
        })
        .slice(0, 100);
      const count = validFeatures.length;

      // 粒子几何体
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      // 存储经纬度，用于连线时计算地理距离（与地图类型无关）
      const lnglatList: [number, number][] = [];

      const color = new THREE.Color();

      validFeatures.forEach((feature: any, i: number) => {
        const [lng, lat] = feature.geometry.coordinates;
        const population = feature.properties?.population || 100000;

        // lnglatToThreePosition 统一处理不同地图的坐标系：
        //   - 默认/Mapbox：返回相对场景中心的 mercator 偏移
        //   - 高德地图：返回绝对 Web Mercator 坐标
        const worldPos = layer.lnglatToThreePosition([lng, lat]);
        positions[i * 3] = worldPos[0];
        positions[i * 3 + 1] = worldPos[1];
        positions[i * 3 + 2] = worldPos[2];
        lnglatList.push([lng, lat]);

        // 根据人口设置颜色
        const colorValue = Math.min(population / 10000000, 1);
        color.setHSL(0.6 - colorValue * 0.5, 1.0, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // 根据人口设置大小
        sizes[i] = Math.max(population / 500000, 5);
      });

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // 粒子材质 - 使用纹理创建发光效果
      // sizeAttenuation: false 使用固定像素大小，避免粒子 z=0 时透视尺寸计算除以零导致异常
      const sprite = createParticleTexture();
      const particleMaterial = new THREE.PointsMaterial({
        size: 8,
        sizeAttenuation: false,
        vertexColors: true,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.8,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      threeScene.add(particles);

      // 创建连接线条（连接相邻的城市）
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x049ef4,
        transparent: true,
        opacity: 0.15,
      });

      const lineGeometry = new THREE.BufferGeometry();
      const linePositions: number[] = [];

      // 连接附近的城市（用经纬度度数衡量距离，与地图类型无关）
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dlng = lnglatList[i][0] - lnglatList[j][0];
          const dlat = lnglatList[i][1] - lnglatList[j][1];
          // 约 4° ≈ 400km
          if (dlng * dlng + dlat * dlat < 16) {
            linePositions.push(
              positions[i * 3],
              positions[i * 3 + 1],
              positions[i * 3 + 2],
              positions[j * 3],
              positions[j * 3 + 1],
              positions[j * 3 + 2],
            );
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      threeScene.add(lines);

      // 添加向上的光束效果
      validFeatures.slice(0, 20).forEach((feature: any) => {
        const coordinates = feature.geometry?.coordinates;
        if (!coordinates) return;

        const [lng, lat] = coordinates;
        if (lng === undefined || lat === undefined || isNaN(lng) || isNaN(lat)) return;
        const beamGeometry = new THREE.CylinderGeometry(1000, 5000, 50000, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
          color: 0x049ef4,
          transparent: true,
          opacity: 0.3,
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        // CylinderGeometry 默认沿 Y 轴，旋转 90° 使其沿 Z 轴（altitude 方向）竖立
        beam.rotation.x = Math.PI / 2;
        // applyObjectLngLat 正确处理不同地图的坐标换算
        layer.applyObjectLngLat(beam, [lng, lat], 25000);
        threeScene.add(beam);
      });
    },
  }).animate(true);

  scene.addLayer(threeJSLayer);

  return scene;
};

/**
 * 创建粒子纹理
 */
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d')!;

  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(4,158,244,0.8)');
  gradient.addColorStop(0.5, 'rgba(4,158,244,0.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
