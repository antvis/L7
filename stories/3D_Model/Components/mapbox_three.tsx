// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
// import { DirectionalLight, Scene as ThreeScene } from 'three';
import * as THREE from 'three';
// tslint:disable-next-line:no-submodule-imports
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { animate, easeInOut } from 'popmotion';
import { Object3D, Vector3 } from 'three';

type ILngLat = [number, number];
let isTravel = false;

function travel(
  mesh: Object3D,
  path: Vector3[],
  duration: number,
  callback?: () => any,
) {
  if (path.length < 2 || isTravel) return;
  isTravel = true;
  let startIndex = 0,
    len = path.length;
  let currentP = path[0],
    nextP = path[1];
  let t = duration / len;

  move(currentP, nextP);
  function move(currentP: Vector3, nextP: Vector3) {
    animate({
      from: {
        x: currentP.x,
        y: currentP.y,
        z: currentP.z,
      },
      to: {
        x: nextP.x,
        y: nextP.y,
        z: nextP.z,
      },
      ease: easeInOut,
      duration: t,
      repeatType: 'loop',
      onUpdate: (o) => {
        mesh.position.set(o.x, o.y, o.z);
      },
      onComplete: () => {
        startIndex++;
        if (startIndex < len - 1) {
          let currentP = path[startIndex],
            nextP = path[startIndex + 1];
          mesh.lookAt(nextP);

          move(currentP, nextP);
        } else {
          isTravel = false;
          callback && callback();
        }
      },
    });
  }
}

export default class GlTFThreeJSDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [112, 35.39847],
        pitch: 45,
        rotation: 30,
        zoom: 5,
      }),
    });
    this.scene = scene;
    scene.registerRenderService(ThreeRender);
    scene.on('loaded', async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      );
      const data = await response.json();
      const polygonlayer = new PolygonLayer({
        name: '01',
      });

      polygonlayer
        .source(data)
        .color('name', [
          '#2E8AE6',
          '#69D1AB',
          '#DAF291',
          '#FFD591',
          '#FF7A45',
          '#CF1D49',
        ])
        .shape('fill')
        .select(true)
        .style({
          opacity: 1.0,
        });
      scene.addLayer(polygonlayer);
      const threeJSLayer = new ThreeLayer({
        enableMultiPassRenderer: false,
        // @ts-ignore
        onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
          // 添加光
          threeScene.add(new THREE.AmbientLight(0xffffff));
          const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
          sunlight.position.set(0, 80000000, 100000000);
          sunlight.matrixWorldNeedsUpdate = true;
          threeScene.add(sunlight);

          let lineData: ILngLat[] = [
            [116.71874999999999, 26.745610382199022],
            [117.3779296875, 28.8831596093235],
            [115.75195312499999, 31.466153715024294],
            [113.466796875, 33.32134852669881],
            [113.9501953125, 35.85343961959182],
            [115.400390625, 38.272688535980976],
            [116.5869140625, 40.3130432088809],
            [115.6201171875, 42.261049162113856],
            [112.236328125, 42.94033923363181],
            [109.3798828125, 41.04621681452063],
            [103.84277343749999, 39.80853604144591],
            [98.9208984375, 39.842286020743394],
            [95.2294921875, 40.713955826286046],
            [91.7138671875, 39.87601941962116],
            [90.8349609375, 37.125286284966805],
            [90.3076171875, 35.88905007936091],
            [90.703125, 33.284619968887675],
            [92.94433593749999, 31.98944183792288],
            [96.2841796875, 32.21280106801518],
            [98.87695312499999, 32.0639555946604],
            [102.919921875, 28.459033019728043],
            [107.9736328125, 28.497660832963472],
            [108.10546875, 24.206889622398023],
            [109.072265625, 23.039297747769726],
            [112.763671875, 24.44714958973082],
            [116.54296874999999, 25.958044673317843],
          ];

          let lineCoordData = lineData.map((d: ILngLat) => {
            return layer.lnglatToCoord(d);
          });
          // console.log(lineCoordData)

          var material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
          });

          var rawPoints: THREE.Vector3[] = [];
          lineCoordData.map((d) => {
            rawPoints.push(new THREE.Vector3(d[0], d[1], 0));
          });
          var curve = new THREE.CatmullRomCurve3(rawPoints);
          var points = curve.getPoints(200);
          var geometry = new THREE.BufferGeometry().setFromPoints(points);

          var material = new THREE.LineBasicMaterial({ color: 0xff0000 });

          var line = new THREE.LineLoop(geometry, material);
          threeScene.add(line);

          // console.log(line)
          // animate({
          //   from: 0,
          //   to: 100,
          //   duration: 3000,
          //   onUpdate: latest => console.log(latest)
          // })

          // 使用 Three.js glTFLoader 加载模型
          const loader = new GLTFLoader();
          loader.load(
            // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
            // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf',
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/radar/34M_17.gltf',
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/duck/Duck.gltf', // duck
            'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/truck/CesiumMilkTruck.gltf', // Truck
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/man/CesiumMan.gltf',
            // 'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            (gltf) => {
              // 根据 GeoJSON 数据放置模型
              const gltfScene = gltf.scene.clone();
              layer.getSource().data.dataArray.forEach(({ coordinates }) => {
                layer.adjustMeshToMap(gltfScene);
                gltfScene.scale.set(500000, 500000, 500000);

                // gltfScene.rotation.y = Math.PI

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

              let center = scene.getCenter();
              // layer.setObjectLngLat(gltfScene, [center.lng + 0.05, center.lat] as ILngLat, 0)

              // let t = 0
              // setInterval(() => {
              //   t += 0.01
              //   layer.setObjectLngLat(gltfScene, [center.lng, center.lat + Math.sin(t) * 10] as ILngLat, 0)
              //   // layer.setObjectLngLat(model, [center.lng + 0.2, center.lat], 0)
              // }, 16)

              // travel(gltfScene, points, 5000)
              travelLoop();
              function travelLoop() {
                travel(gltfScene, points, 5000, () => {
                  travelLoop();
                });
              }
              // 重绘图层
              layer.render();
            },
          );
        },
      })
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [112, 35.39847],
              },
            },
          ],
        })
        .animate(true);
      scene.addLayer(threeJSLayer);
    });
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
