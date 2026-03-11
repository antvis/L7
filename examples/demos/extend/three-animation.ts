import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Three.js 动画效果演示
 * 展示动态旋转、缩放和波动的 3D 对象
 */
export const threeAnimation: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    // Three.js r163+ 需要 WebGL2，必须使用 'device' 渲染器
    renderer: 'device',
    mapConfig: {
      style: 'dark',
      center: [116.4074, 39.9042],
      zoom: 12,
      pitch: 45,
      rotation: 0,
    },
  });

  scene.registerRenderService(ThreeRender);

  const center = scene.getCenter();
  const animatedObjects: Array<{
    mesh: THREE.Mesh;
    type: 'rotate' | 'pulse' | 'wave';
    speed: number;
    initialScale: number;
  }> = [];

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 环境光照
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.4));

      // 主光源
      const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(50, 100, 50);
      threeScene.add(mainLight);

      // 彩色点光源
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      colors.forEach((color, i) => {
        const angle = (i / colors.length) * Math.PI * 2;
        const radius = 0.05;
        const light = new THREE.PointLight(color, 1, 20000);
        layer.setObjectLngLat(
          light,
          [center.lng + Math.cos(angle) * radius, center.lat + Math.sin(angle) * radius],
          5000,
        );
        threeScene.add(light);
      });

      // 创建旋转的环
      for (let i = 0; i < 3; i++) {
        const radius = 2000 + i * 1500;
        const tube = 200;
        const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
        const material = new THREE.MeshPhongMaterial({
          color: [0x049ef4, 0x00ff88, 0xff6600][i],
          emissive: [0x049ef4, 0x00ff88, 0xff6600][i],
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.8,
        });
        const torus = new THREE.Mesh(geometry, material);

        // 不同的初始旋转
        torus.rotation.x = Math.PI / 2 + i * 0.3;
        torus.rotation.y = i * 0.5;

        layer.setObjectLngLat(torus, [center.lng, center.lat], 0);
        threeScene.add(torus);

        animatedObjects.push({
          mesh: torus,
          type: 'rotate',
          speed: 0.01 * (i + 1) * (i % 2 === 0 ? 1 : -1),
          initialScale: 1,
        });
      }

      // 创建脉冲球体
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const distance = 0.03;
        const geometry = new THREE.SphereGeometry(500, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: 0xff3366,
          emissive: 0xff3366,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.7,
        });
        const sphere = new THREE.Mesh(geometry, material);

        layer.setObjectLngLat(
          sphere,
          [center.lng + Math.cos(angle) * distance, center.lat + Math.sin(angle) * distance],
          1000,
        );
        threeScene.add(sphere);

        animatedObjects.push({
          mesh: sphere,
          type: 'pulse',
          speed: 0.02 + i * 0.005,
          initialScale: 1,
        });
      }

      // 创建波动效果的地表
      const planeGeometry = new THREE.PlaneGeometry(20000, 20000, 32, 32);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x049ef4,
        emissive: 0x0044aa,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.5,
        wireframe: true,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;

      // 保存原始顶点位置用于动画
      const positions = planeGeometry.attributes.position.array as Float32Array;
      plane.userData.originalPositions = new Float32Array(positions);

      layer.setObjectLngLat(plane, [center.lng, center.lat], -500);
      threeScene.add(plane);

      animatedObjects.push({
        mesh: plane,
        type: 'wave',
        speed: 0.02,
        initialScale: 1,
      });

      // 创建中心发光核心
      const coreGeometry = new THREE.IcosahedronGeometry(800, 2);
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x049ef4,
        emissiveIntensity: 0.8,
        flatShading: true,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      layer.setObjectLngLat(core, [center.lng, center.lat], 3000);
      threeScene.add(core);

      animatedObjects.push({
        mesh: core,
        type: 'rotate',
        speed: 0.03,
        initialScale: 1,
      });

      // 动画更新
      const clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();

        animatedObjects.forEach((obj) => {
          if (obj.type === 'rotate') {
            obj.mesh.rotation.z += obj.speed;
            obj.mesh.rotation.x += obj.speed * 0.5;
          } else if (obj.type === 'pulse') {
            const scale = obj.initialScale + Math.sin(time * 3 + obj.speed * 100) * 0.3;
            obj.mesh.scale.set(scale, scale, scale);
          } else if (obj.type === 'wave') {
            const positions = (obj.mesh.geometry as THREE.PlaneGeometry).attributes.position
              .array as Float32Array;
            const originals = obj.mesh.userData.originalPositions as Float32Array;

            for (let i = 0; i < positions.length; i += 3) {
              const x = originals[i];
              const y = originals[i + 1];
              positions[i + 2] =
                Math.sin(x * 0.001 + time) * 500 + Math.cos(y * 0.001 + time) * 500;
            }

            (obj.mesh.geometry as THREE.PlaneGeometry).attributes.position.needsUpdate = true;
            obj.mesh.geometry.computeVertexNormals();
          }
        });

        requestAnimationFrame(animate);
      };

      animate();
    },
  }).animate(true);

  scene.addLayer(threeJSLayer);

  return scene;
};
