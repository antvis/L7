import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: { map: string; renderer: string }) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer,
    enableWebGPU: true,
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });

  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          testOpacity: 0.8,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [113.8623046875, 30.031055426540206],
              [116.3232421875, 30.031055426540206],
              [116.3232421875, 31.090574094954192],
              [113.8623046875, 31.090574094954192],
              [113.8623046875, 30.031055426540206],
            ],
          ],
        },
      },
    ],
  };

  const data2 = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          testOpacity: 0.8,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [113.8623046875, 30.031055426540206],
              [115.3232421875, 30.031055426540206],
              [115.3232421875, 31.090574094954192],
              [113.8623046875, 31.090574094954192],
              [113.8623046875, 30.031055426540206],
            ],
          ],
        },
      },
    ],
  };

  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source(data)
    .shape('fill')
    .color('red')
    .active(true)
    .style({
      opacity: 0.5,
      opacityLinear: {
        enable: true,
        dir: 'in',
      },
    });

  scene.on('loaded', () => {
    scene.addLayer(layer);
  });
}
