import { Scene } from '@l7/scene';
import { LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  center: [116.3956,39.9392],
  pitch: 0,
  zoom: 10,
  rotation: 0,
  type: 'mapbox',
  style: 'dark',
});

fetch('https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new LineLayer({
      })
        .source(data)
        .size(1.5)
        .shape('line')
        .color(
          '标准名称',
          ['#5B8FF9','#5CCEA1','#F6BD16' ]
        )
    scene.addLayer(layer);
    console.log(layer);

  });
