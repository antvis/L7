import { Scene } from '@l7/scene';
import { PointLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  pitch: 64.88,
  type: 'amap',
  style: 'dark',
  center: [ 114.060288, 22.53684 ],
  zoom: 15.63
});
window.mapScene = scene;
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json'
)
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data)
      .size(2)
      .color('h8', [
        '#0A3663',
        '#1558AC',
        '#3771D9',
        '#4D89E5',
        '#64A5D3',
        '#72BED6',
        '#83CED6',
        '#A6E1E0',
        '#B8EFE2',
        '#D7F9F0'
      ])
      .style({
        opacity: 1
      });

    scene.addLayer(pointLayer);
  });
