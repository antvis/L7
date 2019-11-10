import { Scene } from '@l7/scene';
import { DashLineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [102.602992, 23.107329],
  zoom: 4,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/9f6afbcd-3aec-4a26-bd4a-2276d3439e0d.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new DashLineLayer({
      })
        .source(data)
        .scale('value',{
          type: 'quantile'
        })
        .size('value', [0.5, 1, 1.5, 2])
        .shape('line')
        .color('value', ['#FFF2E8', '#FFCEA7', '#F0A66C', '#CC464B', '#8A191A'])
    scene.addLayer(layer);
    console.log(layer);

  });
