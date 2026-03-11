import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Three.js 自定义着色器材质演示
 * 展示使用 GLSL 着色器创建的特效
 */
export const threeShader: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    // Three.js r163+ 需要 WebGL2，必须使用 'device' 渲染器
    renderer: 'device',
    mapConfig: {
      style: 'dark',
      center: [121.48, 31.24],
      zoom: 13,
      pitch: 50,
      rotation: 0,
    },
  });

  scene.registerRenderService(ThreeRender);

  const center = scene.getCenter();

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 环境光照
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.3));

      // 主光源
      const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
      mainLight.position.set(100, 200, 100);
      threeScene.add(mainLight);

      // 1. 创建全息扫描效果
      const scanShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x00ffff) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            // 创建扫描线效果
            float scanLine = sin(vPosition.y * 0.01 - uTime * 3.0) * 0.5 + 0.5;

            // 边缘发光
            float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
            edge = pow(edge, 3.0);

            // 网格效果
            float gridX = step(0.95, fract(vUv.x * 20.0));
            float gridY = step(0.95, fract(vUv.y * 20.0));
            float grid = max(gridX, gridY);

            // 组合效果
            float alpha = scanLine * 0.5 + edge * 0.3 + grid * 0.2;

            gl_FragColor = vec4(uColor * (scanLine + 0.5), alpha * 0.8);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });

      const scanGeometry = new THREE.CylinderGeometry(3000, 3000, 10000, 64, 1, true);
      const scanMesh = new THREE.Mesh(scanGeometry, scanShaderMaterial);
      layer.setObjectLngLat(scanMesh, [center.lng, center.lat], 5000);
      threeScene.add(scanMesh);

      // 2. 创建能量场效果
      const energyPositions: THREE.Vector3[] = [];
      const energyColors: number[] = [];

      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1000 + Math.random() * 2000;
        const x = Math.cos(angle) * radius;
        const y = Math.random() * 5000;
        const z = Math.sin(angle) * radius;

        energyPositions.push(new THREE.Vector3(x, y, z));

        // 蓝到紫的渐变颜色
        const t = Math.random();
        const color = new THREE.Color().setHSL(0.5 + t * 0.2, 1.0, 0.5);
        energyColors.push(color.r, color.g, color.b);
      }

      const energyGeometry = new THREE.BufferGeometry().setFromPoints(energyPositions);
      energyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(energyColors, 3));

      const energyShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 100 },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uSize;
          attribute vec3 color;
          varying vec3 vColor;

          void main() {
            vColor = color;

            // 添加上下浮动动画
            vec3 pos = position;
            pos.y += sin(uTime * 2.0 + position.x * 0.001) * 200.0;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // 点的大小随距离变化
            gl_PointSize = uSize * (1000.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            // 创建圆形粒子
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);

            if (dist > 0.5) discard;

            // 边缘柔化
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

            // 发光效果
            float glow = 1.0 - dist * 2.0;
            glow = pow(glow, 2.0);

            gl_FragColor = vec4(vColor * (1.0 + glow), alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const energyPoints = new THREE.Points(energyGeometry, energyShaderMaterial);
      layer.setObjectLngLat(energyPoints, [center.lng, center.lat], 0);
      threeScene.add(energyPoints);

      // 3. 创建地面波纹效果
      const rippleShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uCenter;
          varying vec2 vUv;

          void main() {
            float dist = distance(vUv, uCenter);

            // 多层波纹
            float ripple1 = sin(dist * 50.0 - uTime * 3.0);
            float ripple2 = sin(dist * 30.0 - uTime * 2.0 + 1.0);
            float ripple3 = sin(dist * 70.0 - uTime * 4.0 + 2.0);

            float combined = (ripple1 + ripple2 + ripple3) / 3.0;

            // 强度随距离衰减
            float attenuation = 1.0 - smoothstep(0.0, 0.5, dist);

            // 颜色
            vec3 color1 = vec3(0.0, 0.6, 1.0); // 蓝色
            vec3 color2 = vec3(0.0, 1.0, 0.8); // 青色
            vec3 finalColor = mix(color1, color2, combined * 0.5 + 0.5);

            float alpha = attenuation * (combined * 0.3 + 0.2);

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const rippleGeometry = new THREE.PlaneGeometry(10000, 10000);
      const rippleMesh = new THREE.Mesh(rippleGeometry, rippleShaderMaterial);
      rippleMesh.rotation.x = -Math.PI / 2;
      layer.setObjectLngLat(rippleMesh, [center.lng, center.lat], 10);
      threeScene.add(rippleMesh);

      // 4. 创建上升的数据流效果
      const streamCount = 30;
      const streams: Array<{
        mesh: THREE.Mesh;
        speed: number;
        initialY: number;
      }> = [];

      for (let i = 0; i < streamCount; i++) {
        const streamGeometry = new THREE.CylinderGeometry(20, 20, 200 + Math.random() * 300, 8);
        const streamMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.6,
        });
        const stream = new THREE.Mesh(streamGeometry, streamMaterial);

        const angle = (i / streamCount) * Math.PI * 2;
        const radius = 500 + Math.random() * 1500;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        stream.position.set(x, 0, z);

        const container = new THREE.Group();
        container.add(stream);
        layer.setObjectLngLat(container, [center.lng, center.lat], 0);
        threeScene.add(container);

        streams.push({
          mesh: stream,
          speed: 50 + Math.random() * 100,
          initialY: stream.position.y,
        });
      }

      // 动画更新
      const clock = new THREE.Clock();

      const animate = () => {
        const time = clock.getElapsedTime();

        // 更新着色器 uniforms
        scanShaderMaterial.uniforms.uTime.value = time;
        energyShaderMaterial.uniforms.uTime.value = time;
        rippleShaderMaterial.uniforms.uTime.value = time;

        // 旋转扫描效果
        scanMesh.rotation.y = time * 0.5;

        // 更新数据流位置
        streams.forEach((stream) => {
          stream.mesh.position.y += stream.speed;
          if (stream.mesh.position.y > 5000) {
            stream.mesh.position.y = 0;
          }
          // 透明度随高度变化
          const opacity = 1.0 - stream.mesh.position.y / 5000;
          (stream.mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
        });

        requestAnimationFrame(animate);
      };

      animate();
    },
  }).animate(true);

  scene.addLayer(threeJSLayer);

  return scene;
};
