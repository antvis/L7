// @ts-ignore
import { Scene, AMap } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
// import { DirectionalLight, Scene as ThreeScene } from 'three';
import * as THREE from 'three';
// tslint:disable-next-line:no-submodule-imports
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { animate, easeInOut } from 'popmotion';

export default class Aspace extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public changeValue(startValue: number, endValue: number, callback: any) {
    animate({
      from: {
        v: startValue,
      },
      to: {
        v: endValue,
      },
      ease: easeInOut,
      duration: 500,
      onUpdate: (o) => {
        callback(o.v);
      },
      onComplete: () => {},
    });
  }

  public async componentDidMount() {
    const raycaster = new THREE.Raycaster();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    let lng = 120.1008;
    // 120.0640
    let lat = 30.2573;

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [lng, lat],
        pitch: 70,
        rotation: 210,
        zoom: 16,
        // layers: [new AMap.TileLayer.Satellite()],
      }),
    });
    this.scene = scene;
    scene.registerRenderService(ThreeRender);
    scene.on('loaded', () => {
      const threeJSLayer = new ThreeLayer({
        enableMultiPassRenderer: false,
        // @ts-ignore
        onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
          threeScene.add(new THREE.AmbientLight(0xffffff));
          const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
          sunlight.position.set(0, 80000000, 100000000);
          sunlight.matrixWorldNeedsUpdate = true;
          threeScene.add(sunlight);

          let center = scene.getCenter();
          // map
          // https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ

          // height
          // https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ

          let image = new Image();
          image.crossOrigin = '';
          image.src =
            'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ';
          image.onload = () => {
            let canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            let heightData = ctx.getImageData(0, 0, image.width, image.height)
              .data;

            let s = 53000;

            var geometry = new THREE.PlaneGeometry(s, s, 255, 255);

            geometry.vertices.map((v, i) => {
              let r = heightData[i * 4];
              let g = heightData[i * 4 + 1];
              let b = heightData[i * 4 + 2];

              let h =
                -10000.0 +
                (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) *
                  0.1;
              h = h / 20 - 127600;
              h = Math.max(0, h);

              v.z = h;
            });
            var material = new THREE.MeshPhongMaterial({
              transparent: true,
              // opacity: 0.6,
              map: new THREE.TextureLoader().load(
                'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
              ),
            });
            var plane = new THREE.Mesh(geometry, material);
            layer.setObjectLngLat(plane, [center.lng, center.lat], 0);
            plane.position.z = 10;
            threeScene.add(plane);
          };

          // 使用 Three.js glTFLoader 加载模型
          const loader = new GLTFLoader();
          loader.load(
            'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            (gltf) => {
              // 根据 GeoJSON 数据放置模型
              const gltfScene = gltf.scene;

              layer.adjustMeshToMap(gltfScene);
              // layer.setMeshScale(gltfScene, 50, 50, 50);
              layer.setMeshScale(gltfScene, 10, 10, 10);

              layer.setObjectLngLat(
                gltfScene,
                [center.lng - 0.005, center.lat],
                0,
              );

              // const animations = gltf.animations;
              // if (animations && animations.length) {
              //   const mixer = new THREE.AnimationMixer(gltfScene);

              //   const animation = animations[1];

              //   const action = mixer.clipAction(animation);

              //   action.play();

              //   layer.addAnimateMixer(mixer);
              // }
              // gltfScene.rotation.y = Math.PI;
              // 向场景中添加模型
              threeScene.add(gltfScene);
              // 重绘图层
              layer.render();
            },
          );

          let v = `
          varying vec2 vUv;
          varying vec4 worldPosition;
          void main() {
              vUv = uv;
              worldPosition = modelMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`;
          let f = `
          varying vec2 vUv;
          varying vec4 worldPosition;
          uniform vec3 color;
          void main() {
            // gl_FragColor = vec4(color, fract(vUv.y * 5.0));
            gl_FragColor = vec4(color, fract(worldPosition.z / 20.0));
          }`;
          let shadermaterial = new THREE.ShaderMaterial({
            uniforms: {
              color: {
                value: new THREE.Vector3(0.21372549, 0.34705882, 0.56470588),
              },
            },
            vertexShader: v,
            fragmentShader: f,
          });

          // load ZSpace
          loader.load(
            // 'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            'https://gw.alipayobjects.com/os/bmw-prod/ba11fe2b-7937-441e-8e45-2b5178bd8ede.gltf',
            (gltf) => {
              const zspace = gltf.scene;
              layer.adjustMeshToMap(zspace);
              // console.log(zspace.children[0])2
              // @ts-ignore
              zspace.children[0].material = shadermaterial;
              // layer.setMeshScale(gltfScene, 50, 50, 50);
              layer.setMeshScale(zspace, 8, 8, 8);

              layer.setObjectLngLat(zspace, [120.1015, 30.2661], 0);
              zspace.rotation.y = -Math.PI * (17.5 / 15);
              threeScene.add(zspace);
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
                coordinates: [111.4453125, 32.84267363195431],
              },
            },
          ],
        })
        .animate(true);
      scene.addLayer(threeJSLayer);
      // @ts-ignore
      scene?.map?.on('camerachange', (e: any) => {
        // @ts-ignore
        let currentCamera = threeJSLayer?.getRenderCamera();
        // @ts-ignore
        let size = scene?.map?.getSize();

        scene.on('click', (ev) => {
          // throw new Error('')
          console.log('click', ev);
          console.log('size', size);
        });
      });
    });

    // setTimeout(() => {
    //   this.changeValue(210, 150, (r: number) => {
    //     scene.setRotation(r)
    //   })
    //   scene.setCenter([lng - 0.01, lat])
    // }, 2000)

    // @ts-ignore
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
