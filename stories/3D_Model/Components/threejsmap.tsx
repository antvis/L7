// @ts-ignore
import { Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
// import { DirectionalLight, Scene as ThreeScene } from 'three';
import * as THREE from 'three';

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
        center: [120, 25],
        pitch: 65,
        rotation: 30,
        zoom: 8,
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

          let points = [
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

          // @ts-ignore
          let lnglatPoints = points.map((p) => layer.lnglatToCoord(p));
          // console.log(lnglatPoints)

          const shape = new THREE.Shape();
          // shape.moveTo( 0,0 );
          // shape.lineTo( 0, 100000 );
          // shape.lineTo( 100000, 10000 );
          // shape.lineTo( 10000, 0 );
          // shape.lineTo( 0, 0 );

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
          // uniform vec3 color;
          varying float h;
          void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0 - h/${h}.0);
          }`;

          const material = new THREE.ShaderMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            vertexShader: v0,
            fragmentShader: f0,
          });
          const shader_material = new THREE.ShaderMaterial({
            uniforms: {
              //   texture: {
              //     // 加载纹理贴图返回Texture对象作为texture的值
              //     // Texture对象对应着色器中sampler2D数据类型变量
              //     value: new THREE.TextureLoader().load('./Earth.png')
              // },
            },

            depthTest: false,
            // depthWrite: false,
            // blending: '',
            transparent: true,
            vertexShader: v,
            fragmentShader: f,
            side: THREE.DoubleSide, // 双面可见
          });

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const mesh = new THREE.Mesh(geometry, [material, shader_material]);

          threeScene.add(mesh);
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
