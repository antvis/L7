import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import Stats from 'stats.js';
import data from '../../data/globe-earthquake-mag.json';

export function MapRender(option: { map: string; renderer: string }) {
  const scene = new Scene({
    id: 'map',
    // renderer: 'regl',
    renderer: option.renderer,
    enableWebGPU: true,
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
    map: new allMap[option.map || 'Map']({
      style: 'light',
      pitch: 20,
      center: [120, 20],
      zoom: 3,
    }),
  });
  scene.on('loaded', () => {
    data.features = [
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
      ...data.features,
    ];
    const pointLayer = new PointLayer({})
      .source(data)
      .shape('circle')
      .size(15)
      .color('mag', (mag) => {
        return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
      })
      .active(true)
      .style({
        opacity: 0.6,
        strokeWidth: 3,
      });
    scene.addLayer(pointLayer);
  });

  // stats.js
  const stats = new Stats();
  stats.showPanel(0);
  const $stats = stats.dom;
  $stats.style.position = 'absolute';
  $stats.style.left = '0px';
  $stats.style.bottom = '0px';
  document.body.appendChild($stats);

  const tick = () => {
    stats.update();

    requestAnimationFrame(tick);
  };
  tick();
}
