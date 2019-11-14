import { Scene } from '@l7/scene';
import { HeatMapLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  style: 'dark',
  pitch: 0,
  center: [103.693879, 34.38704],
  type: 'mapbox',
  zoom: 3.69,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new HeatMapLayer({
      })
      .source(data).size('mag', [0, 1.0]) // weight映射通道
        .style({
          intensity: 2,
          radius: 20,
          opacity: 1.0,
          rampColors: {
            colors: ['#2E8AE6', '#69D1AB', '#DAF291', '#FFD591', '#FF7A45', '#CF1D49'],
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
          }
        })
    scene.addLayer(layer);


  });
