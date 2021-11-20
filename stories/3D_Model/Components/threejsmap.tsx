// @ts-ignore
import { Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
import * as THREE from 'three';

const points = [
  [120.44353624, 22.44126139],
  [120.64050836, 22.24136664],
  [120.70155111, 21.92708306],
  [120.87288601, 21.89738661],
  [120.91492974, 22.30271186],
  [121.03327772, 22.65070394],
  [121.32468397, 22.94568359],
  [121.47954183, 23.3223055],
  [121.64384793, 24.09772976],
  [121.80915717, 24.33907227],
  [121.89250353, 24.6179267],
  [121.84504259, 24.83625488],
  [122.01220106, 25.00145101],
  [121.91709391, 25.13789361],
  [121.62302734, 25.29467556],
  [121.02468424, 25.04048774],
  [120.82376736, 24.68830973],
  [120.68867757, 24.60069417],
  [120.24576172, 23.84053168],
  [120.10276177, 23.70096951],
  [120.10784668, 23.34126356],
  [120.02320774, 23.10765544],
  [120.13473334, 22.99400635],
  [120.29720052, 22.53133111],
  [120.44353624, 22.44126139],
];

function iniCylinder(size: number, height: number) {
  const geometry = new THREE.CylinderGeometry(size, size, height, 32);
  const material = new THREE.MeshBasicMaterial({
    color: '#0ff',
    transparent: true,
    opacity: 0.5,
    depthTest: false,
  });
  const cylinder = new THREE.Mesh(geometry, material);
  return cylinder;
}

async function initPlane(text: string, src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'none';
    image.onload = function() {
      const width = image.width;
      const height = image.height;
      const canvas = document.createElement('canvas');
      canvas.width = width * 10;
      canvas.height = height * 10;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.globalAlpha = 0.4;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgb(30, 160, 30)';
      ctx.font = `${canvas.height / 3}px bold PingFang-SC-Bold`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const size = 320000;
      const planeGeometry = new THREE.PlaneBufferGeometry(
        size,
        (size * height) / width,
        1,
      );
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        map: texture,
        blending: THREE.AdditiveBlending,
      });

      const plane = new THREE.Mesh(planeGeometry, material);
      plane.renderOrder = 10;

      resolve(plane);
    };
  });
}

const taiwancity = [
  {
    // 台北
    lng: 121.5,
    lat: 25.05,
    population: 2602418,
  },
  {
    // 台中
    lng: 120.5804443359,
    lat: 24.2,
    population: 2820787,
  },
  {
    // 台南
    lng: 120.193176269531,
    lat: 22.9963233068,
    population: 1874917,
  },
  {
    // 高雄
    lng: 120.30578613281,
    lat: 22.62415215809,
    population: 2765932,
  },
  {
    // 桃园
    lng: 121.15,
    lat: 24.9,
    population: 2268807,
  },
];

export default class Threemap extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.5, 24],
        pitch: 60,
        rotation: 0,
        zoom: 8.2,
        style: 'dark',
      }),
    });
    this.scene = scene;

    scene.registerRenderService(ThreeRender);

    const img1 =
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*zMw0T6gEIZYAAAAAAAAAAAAAARQnAQ';

    let plane0 = (await initPlane('台北：260.24万', img1)) as THREE.Object3D;
    let plane1 = (await initPlane('台中：282.07万', img1)) as THREE.Object3D;
    let plane2 = (await initPlane('台南：187.49万', img1)) as THREE.Object3D;
    let plane3 = (await initPlane('高雄：276.59万', img1)) as THREE.Object3D;
    let plane4 = (await initPlane('桃园：266.88万', img1)) as THREE.Object3D;
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

          // @ts-ignore
          let lnglatPoints = points.map((p) => layer.lnglatToCoord(p));

          const shape = new THREE.Shape();

          shape.moveTo(lnglatPoints[0][0], lnglatPoints[0][1]);
          for (let i = 1; i < lnglatPoints.length; i++) {
            shape.lineTo(lnglatPoints[i][0], lnglatPoints[i][1]);
          }
          shape.lineTo(lnglatPoints[0][0], lnglatPoints[0][1]);

          const h = 100000;
          const extrudeSettings = {
            steps: 2,
            depth: h,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1,
          };
          const v0 = `
          void main() {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`;

          const f0 = `
          void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }`;

          const v = `
          varying vec2 vUv;
          varying float h;
          void main() {
              vUv = uv;
              h = position.z;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`;

          const f = `
          varying vec2 vUv;
          varying float h;
          void main() {
            gl_FragColor = vec4(0.92549, 1.0, 0.91372549, 1.0 - h/${h}.0);
          }`;

          const material = new THREE.ShaderMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            vertexShader: v0,
            fragmentShader: f0,
          });
          const shader_material = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: v,
            fragmentShader: f,
            side: THREE.DoubleSide, // 双面可见
          });

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const mesh = new THREE.Mesh(geometry, [material, shader_material]);
          mesh.renderOrder = -1;
          threeScene.add(mesh);

          let planes = [plane0, plane1, plane2, plane3, plane4];

          taiwancity.map(
            (item: { lng: number; lat: number; population: number }, index) => {
              let cylinderSize = item.population / 50;
              let cylinderHeight = item.population / 10;

              planes[index].rotation.x = Math.PI / 2;
              layer.setObjectLngLat(
                planes[index],
                [item.lng, item.lat],
                cylinderHeight * 1.5,
              );
              threeScene.add(planes[index]);

              let cylinder = iniCylinder(cylinderSize, cylinderHeight);
              cylinder.rotation.x = Math.PI / 2;
              layer.setObjectLngLat(
                cylinder,
                [item.lng, item.lat],
                cylinderHeight / 2,
              );
              threeScene.add(cylinder);
            },
          );

          layer.setUpdate(() => {
            let z = layer.getRenderCamera().rotation.z;
            planes.map((p) => (p.rotation.y = z));
          });
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
