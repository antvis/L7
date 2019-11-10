import { Scene } from '@l7/scene';
import { LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [120.2336, 30.2002],
  zoom: 15,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/65e9cebb-8063-45e7-b18f-727da84e9908.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new LineLayer({
      })
        .source(data)
        .size(1.5)
        .shape('line')
        .color(
          'name',
          ['#5B8FF9','#5CCEA1','#7B320A' ]
        )
    scene.addLayer(layer);
    console.log(layer);

  });
