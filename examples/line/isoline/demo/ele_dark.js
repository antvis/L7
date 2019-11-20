import { Scene } from '@l7/scene';
import { LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 26.842105263157915,
  type: 'amap',
  style: 'dark',
  center: [102.601919, 23.108997],
  zoom: 14.22,
});

fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new LineLayer({
      })
        .source(data)
        .size('ELEV', (h) => {
          return [h % 50 === 0 ? 1.0 : 0.5, (h -1300) *20 ];
        })
        .shape('line')
        .scale('ELEV', {
          type: 'quantize'
        })
        .color(
          'ELEV',[
    '#094D4A', '#146968',
    '#1D7F7E', '#289899',
    '#34B6B7', '#4AC5AF',
    '#5FD3A6', '#7BE39E',
    '#A1EDB8', '#CEF8D6'
    ],
        )
    scene.addLayer(layer);
    console.log(layer);

  });