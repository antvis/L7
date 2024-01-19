import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: { map: string; renderer: string }) {
  console.log(option);
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

  const colors = [
    '#87CEFA',
    '#00BFFF',

    '#7FFFAA',
    '#00FF7F',
    '#32CD32',

    '#F0E68C',
    '#FFD700',

    '#FF7F50',
    '#FF6347',
    '#FF0000',
  ];
  scene.on('loaded', () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const filllayer = new PolygonLayer({
          name: 'fill',
          zIndex: 3,
          autoFit: true,
        })
          .source(data)
          .shape('extrude')
          .active(true)
          .size('unit_price', (unit_price) => unit_price)
          .color('count', [
            '#f2f0f7',
            '#dadaeb',
            '#bcbddc',
            '#9e9ac8',
            '#756bb1',
            '#54278f',
          ])
          .style({
            pickLight: true,

            opacity: 1,
          });
        scene.addLayer(filllayer);
      });
  });
}
