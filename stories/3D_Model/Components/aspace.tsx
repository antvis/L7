// @ts-ignore
import { Scene, AMap } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
// import { DirectionalLight, Scene as ThreeScene } from 'three';
import * as THREE from 'three';
// tslint:disable-next-line:no-submodule-imports
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { animate, easeInOut } from 'popmotion';
interface IView {
  lng: number;
  lat: number;
  pitch: number;
  rotation: number;
  zoom: number;
}
function changeValue(
  startValue: number | IView,
  endValue: number | IView,
  duration: number = 500,
  callback: any,
  complete?: any,
) {
  if (typeof startValue === 'number') {
    animate({
      from: {
        v: startValue,
      },
      to: {
        v: endValue,
      },
      ease: easeInOut,
      duration,
      onUpdate: (o) => {
        callback(o.v);
      },
      onComplete: () => {
        complete && complete();
      },
    });
  } else {
    animate({
      from: {
        lng: startValue.lng,
        lat: startValue.lat,
        pitch: startValue.pitch,
        rotation: startValue.rotation,
        zoom: startValue.zoom,
      },
      to: {
        lng: (endValue as IView).lng,
        lat: (endValue as IView).lat,
        pitch: (endValue as IView).pitch,
        rotation: (endValue as IView).rotation,
        zoom: (endValue as IView).zoom,
      },
      ease: easeInOut,
      duration,
      onUpdate: (o) => {
        callback(o);
      },
      onComplete: () => {
        complete && complete();
      },
    });
  }
}
export default class Aspace extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const raycaster = new THREE.Raycaster();
    let lng = 120.1;
    let lat = 30.265;

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [lng, lat],
        pitch: 70,
        rotation: 220,
        zoom: 16,
      }),
    });
    this.scene = scene;
    scene.registerRenderService(ThreeRender);

    let mouse = new THREE.Vector2();
    let zspace: THREE.Object3D,
      aspace: THREE.Object3D,
      ASpaceTextMesh: THREE.Object3D,
      ZSpaceTextMesh: THREE.Object3D;
    scene.on('loaded', () => {
      const center = scene.getCenter();

      const threeJSLayer = new ThreeLayer({
        enableMultiPassRenderer: false,
        // @ts-ignore
        onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
          threeScene.add(new THREE.AmbientLight(0xffffff));
          const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
          sunlight.position.set(0, 80000000, 100000000);
          sunlight.matrixWorldNeedsUpdate = true;
          threeScene.add(sunlight);

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
            layer.setObjectLngLat(plane, [120.1008, 30.2573], 0);
            plane.position.z = 10;
            threeScene.add(plane);
          };

          // 使用 Three.js glTFLoader 加载模型
          const loader = new GLTFLoader();
          loader.load(
            'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            (gltf) => {
              const antModel = gltf.scene;
              layer.adjustMeshToMap(antModel);
              layer.setMeshScale(antModel, 20, 20, 20);
              layer.setObjectLngLat(
                antModel,
                [center.lng - 0.002, center.lat],
                0,
              );

              const animations = gltf.animations;
              if (animations && animations.length) {
                const mixer = new THREE.AnimationMixer(antModel);
                const animation = animations[1];
                const action = mixer.clipAction(animation);
                action.play();
                layer.addAnimateMixer(mixer);
              }
              antModel.rotation.y = Math.PI;
              // 向场景中添加模型
              threeScene.add(antModel);
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
            gl_FragColor = vec4(color, fract(worldPosition.z / 50.0));
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

          let fbxLoaded = new FBXLoader();
          // load ZSpace
          fbxLoaded.load(
            'https://gw.alipayobjects.com/os/bmw-prod/af1652c9-3c4f-4e73-ac4c-1f78fefbaf6a.fbx',
            (gltf) => {
              zspace = gltf;
              layer.adjustMeshToMap(zspace);
              // @ts-ignore
              zspace.children[0].material = shadermaterial;
              layer.setMeshScale(zspace, 10, 10, 10);

              layer.setObjectLngLat(zspace, [120.1015, 30.2661], 0);
              zspace.rotation.x = Math.PI * 2;
              zspace.rotation.z = -Math.PI * (-2 / 15);
              threeScene.add(zspace);
            },
          );

          fbxLoaded.load(
            'https://gw.alipayobjects.com/os/bmw-prod/11d6e4c1-bd5b-4dc1-bae5-ac51c14e9056.fbx',
            (model) => {
              aspace = model;
              layer.adjustMeshToMap(aspace);
              // @ts-ignore
              aspace.children[0].material = shadermaterial;

              layer.setMeshScale(aspace, 8, 8, 8);
              layer.setObjectLngLat(aspace, [120.099, 30.261], 0);
              aspace.rotation.x = Math.PI * 2;
              aspace.rotation.z = -Math.PI * (3 / 15);
              threeScene.add(aspace);
            },
          );

          let textLoader = new THREE.FontLoader();
          textLoader.load(
            'https://gw.alipayobjects.com/os/bmw-prod/0a3f46eb-294e-4d95-87f2-052c26ad4bf1.json',
            (font) => {
              let aspaceGeo = new THREE.TextGeometry('ASpace', {
                size: 360, //字号大小，一般为大写字母的高度
                height: 50, //文字的厚度
                font: font, //字体，默认是'helvetiker'，需对应引用的字体文件
                bevelThickness: 10, //倒角厚度
                bevelSize: 10, //倒角宽度
                curveSegments: 30, //弧线分段数，使得文字的曲线更加光滑
                bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
              });
              aspaceGeo.center();
              let zspaceGeo = new THREE.TextGeometry('ZSpace', {
                size: 360, //字号大小，一般为大写字母的高度
                height: 50, //文字的厚度
                font: font, //字体，默认是'helvetiker'，需对应引用的字体文件
                bevelThickness: 10, //倒角厚度
                bevelSize: 10, //倒角宽度
                curveSegments: 30, //弧线分段数，使得文字的曲线更加光滑
                bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
              });
              zspaceGeo.center();

              let fontMat = new THREE.MeshPhongMaterial({
                color: 0xcccccc,
                shininess: 60,
                specular: 0xcccccc,
              });

              const testHeight = 900;

              ASpaceTextMesh = new THREE.Mesh(aspaceGeo, fontMat);
              ASpaceTextMesh.rotation.x = Math.PI / 2;
              ASpaceTextMesh.rotation.y = (-Math.PI * 3) / 4;
              layer.setObjectLngLat(
                ASpaceTextMesh,
                [120.099, 30.261],
                testHeight,
              );
              threeScene.add(ASpaceTextMesh);

              ZSpaceTextMesh = new THREE.Mesh(zspaceGeo, fontMat);
              ZSpaceTextMesh.rotation.x = Math.PI / 2;
              ZSpaceTextMesh.rotation.y = (-Math.PI * 3) / 4;
              layer.setObjectLngLat(
                ZSpaceTextMesh,
                [120.103, 30.2661],
                testHeight,
              );
              threeScene.add(ZSpaceTextMesh);

              getH(0, 200);
              function getH(h1: number, h2: number) {
                changeValue(
                  h1,
                  h2,
                  1000,
                  (h: number) => {
                    ASpaceTextMesh.position.z = testHeight + h;
                    ZSpaceTextMesh.position.z = testHeight + h;
                  },
                  () => {
                    setTimeout(() => getH(h2, h1), 10);
                  },
                );
              }
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
      let currentCamera = threeJSLayer.threeRenderService.getRenderCamera();
      let currentView: IView = {
        lng: center.lng,
        lat: center.lat,
        pitch: 70,
        rotation: 220,
        zoom: 16,
      };

      scene.on('zoom', () => {
        let cen = scene.getCenter();
        currentView.lng = cen.lng;
        currentView.lat = cen.lat;
        currentView.pitch = scene.getPitch();
        currentView.zoom = scene.getZoom();
      });

      scene.getMapService().on('mapchange', (e: any) => {
        // @ts-ignore
        currentCamera = threeJSLayer.getRenderCamera();
        currentView.pitch = scene.getPitch();
      });

      let ASpaceView = {
        lng: 120.108009,
        lat: 30.251129,
        pitch: 83,
        rotation: 225,
        zoom: 16,
      };
      let ZSpaceView = {
        lng: 120.110726,
        lat: 30.256481,
        pitch: 80,
        rotation: 220,
        zoom: 16,
      };

      scene.on('click', (ev) => {
        // @ts-ignore
        let size = scene?.map?.getSize();
        mouse.x = (ev.pixel.x / size.width) * 2 - 1;
        mouse.y = -(ev.pixel.y / size.height) * 2 + 1;
        raycaster.setFromCamera(mouse, currentCamera);
        var intersects = raycaster.intersectObjects([zspace, aspace], true);
        if (intersects.length > 0) {
          let object = intersects[0].object;
          if (object.name === 'Z空间') {
            selectSpace(currentView, ZSpaceView, ZSpaceTextMesh);
          } else {
            selectSpace(currentView, ASpaceView, ASpaceTextMesh);
          }
        }
      });

      function selectSpace(
        currentView: IView,
        targetView: IView,
        spaceText?: THREE.Object3D,
      ) {
        if (spaceText) {
          changeValue(
            spaceText.rotation.y,
            spaceText.rotation.y + Math.PI * 2,
            500,
            (r: number) => {
              spaceText.rotation.y = r;
            },
          );
        }

        changeValue(currentView, targetView, 500, (view: IView) => {
          scene.setCenter([view.lng, view.lat]);
          scene.setPitch(view.pitch);
          scene.setRotation(view.rotation);
          scene.setZoom(view.zoom);

          currentView.lng = view.lng;
          currentView.lat = view.lat;
          currentView.pitch = view.pitch;
          currentView.rotation = view.rotation;
          currentView.zoom = view.zoom;
        });
      }
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
