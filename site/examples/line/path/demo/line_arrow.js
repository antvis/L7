/**
 * Arrow Path Demo
 * 展示带箭头的路径线效果，适用于导航、路径方向等场景。
 */
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [103.83735, 1.3602538],
    zoom: 9.4678190476727,
    pitch: 20,
    style: 'dark',
  }),
});

scene.on('loaded', async () => {
  const data = await (
    await fetch('https://gw.alipayobjects.com/os/rmsportal/dzpMOiLYBKxpdmsgBLoE.json')
  ).json();
  const layer = new LineLayer({})
    .source(data)
    .shape('line')
    .size(4)
    .color('#16f')
    .style({
      arrow: {
        enable: true,
        spacing: 10,
        width: 8,
        height: 4,
        strokeWidth: 4,
        color: '#FFF',
      },
    });

  scene.addLayer(layer);
});
