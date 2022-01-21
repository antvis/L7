import { Scene, PolygonLayer, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { animate, easeInOut } from 'popmotion';

let isTravel = false;

function travel(
  mesh,
  path,
  duration,
  callback
) {
  if (path.length < 2 || isTravel) return;
  isTravel = true;
  let startIndex = 0;
  const len = path.length;
  const currentP = path[0],
    nextP = path[1];
  const t = duration / len;

  move(currentP, nextP);
  function move(currentP, nextP) {
    animate({
      from: {
        x: currentP.x,
        y: currentP.y,
        z: currentP.z
      },
      to: {
        x: nextP.x,
        y: nextP.y,
        z: nextP.z
      },
      ease: easeInOut,
      duration: t,
      repeatType: 'loop',
      onUpdate: o => {
        mesh.position.set(o.x, o.y, o.z);
      },
      onComplete: () => {
        startIndex++;
        if (startIndex < len - 1) {
          const currentP = path[startIndex],
            nextP = path[startIndex + 1];
          mesh.lookAt(nextP);

          move(currentP, nextP);
        } else {
          isTravel = false;
          callback && callback();
        }
      }
    });
  }
}

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 110, 35.39847 ],
    pitch: 20,
    style: 'dark',
    zoom: 3
  })
});

scene.on('loaded', () => {
  scene.registerRenderService(ThreeRender);

  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json'
  )
    .then(d => d.json())
    .then(data => {
      const textLayer = new PointLayer({ zIndex: 1 })
        .source(data)
        .color('rgb(22,119,255)')
        .size(12)
        .shape('name', 'text');


      const polygonlayer = new PolygonLayer({})
        .source(data)
        .color('rgb(22,119,255)')
        .shape('fill')
        .active({
          enable: true,
          blend: 0.5
        })
        .style({
          opacity: 0.6,
          opacityLinear: {
            enable: true,
            dir: 'out' // in - out
          }
        });

      const linelayer = new LineLayer({ })
        .source(data)
        .color('rgb(72,169,255)')
        .shape('line')
        .size(0.5)
        .style({
          opacity: 0.6
        });

      scene.addLayer(polygonlayer);
      scene.addLayer(textLayer);
      scene.addLayer(linelayer);
    });


  const threeJSLayer = new ThreeLayer({
    zIndex: 2,
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 添加光
      threeScene.add(new THREE.AmbientLight(0xffffff));
      const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
      sunlight.position.set(0, 80000000, 100000000);
      sunlight.matrixWorldNeedsUpdate = true;
      threeScene.add(sunlight);

      const lineData = [
        [ 116.71874999999999, 26.745610382199022 ],
        [ 117.3779296875, 28.8831596093235 ],
        [ 115.75195312499999, 31.466153715024294 ],
        [ 113.466796875, 33.32134852669881 ],
        [ 113.9501953125, 35.85343961959182 ],
        [ 115.400390625, 38.272688535980976 ],
        [ 116.5869140625, 40.3130432088809 ],
        [ 115.6201171875, 42.261049162113856 ],
        [ 112.236328125, 42.94033923363181 ],
        [ 109.3798828125, 41.04621681452063 ],
        [ 103.84277343749999, 39.80853604144591 ],
        [ 98.9208984375, 39.842286020743394 ],
        [ 95.2294921875, 40.713955826286046 ],
        [ 91.7138671875, 39.87601941962116 ],
        [ 90.8349609375, 37.125286284966805 ],
        [ 90.3076171875, 35.88905007936091 ],
        [ 90.703125, 33.284619968887675 ],
        [ 92.94433593749999, 31.98944183792288 ],
        [ 96.2841796875, 32.21280106801518 ],
        [ 98.87695312499999, 32.0639555946604 ],
        [ 102.919921875, 28.459033019728043 ],
        [ 107.9736328125, 28.497660832963472 ],
        [ 108.10546875, 24.206889622398023 ],
        [ 109.072265625, 23.039297747769726 ],
        [ 112.763671875, 24.44714958973082 ],
        [ 116.54296874999999, 25.958044673317843 ]
      ];

      const lineCoordData = lineData.map(d => {
        return layer.lnglatToCoord(d);
      });


      const rawPoints = [];
      lineCoordData.map(d => {
        rawPoints.push(new THREE.Vector3(d[0], d[1], 0));
        return '';
      });
      const curve = new THREE.CatmullRomCurve3(rawPoints);
      const points = curve.getPoints(200);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({ color: new THREE.Color('rgb(22,119,255)') });

      const line = new THREE.LineLoop(geometry, material);
      threeScene.add(line);


      // 使用 Three.js glTFLoader 加载模型
      const loader = new GLTFLoader();
      loader.load(
        'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/truck/CesiumMilkTruck.gltf', // Truck
        gltf => {
          // 根据 GeoJSON 数据放置模型
          const gltfScene = gltf.scene.clone();
          setMaterial(gltfScene);
          layer.getSource().data.dataArray.forEach(() => {
            layer.adjustMeshToMap(gltfScene);
            gltfScene.scale.set(500000, 500000, 500000);

            const animations = gltf.animations;
            if (animations && animations.length) {
              const mixer = new THREE.AnimationMixer(gltfScene);
              // @ts-ignore
              for (let i = 0; i < animations.length; i++) {
                const animation = animations[i];

                // There's .3333 seconds junk at the tail of the Monster animation that
                // keeps it from looping cleanly. Clip it at 3 seconds

                const action = mixer.clipAction(animation);

                action.play();
              }
              layer.addAnimateMixer(mixer);
            }

            // 向场景中添加模型
            threeScene.add(gltfScene);
          });

          travelLoop();
          function travelLoop() {
            travel(gltfScene, points, 5000, () => {
              travelLoop();
            });
          }
          // 重绘图层
          layer.render();
        }
      );
    }
  })
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [ 112, 35.39847 ]
          }
        }
      ]
    })
    .animate(true);
  scene.addLayer(threeJSLayer);
});

function setMaterial(object) {
  if (object.children && object.children.length && object.children.length > 0) {
    object.children.map(child => setMaterial(child));
  } else if (object.material) {
    object.material.side = THREE.DoubleSide;
  }
}
