import { Scene } from '@l7/scene';
import { HeatmapLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  style: 'dark',
  pitch: 57.4999999,
  center: [116.49434030056, 39.868073421167621],
  type: 'mapbox',
  zoom: 3,
});
window.mapScene = scene;

fetch('https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new HeatmapLayer({
      })
      .source(data)
      .size('capacity', [0, 1])
      .shape('heatmap3D')
       // weight映射通道
      .style({
        intensity: 10,
        radius: 5,
        opacity: 1.0,
        rampColors: {
          colors:[
            '#2E8AE6',
            '#69D1AB',
            '#DAF291',
            '#FFD591',
            '#FF7A45',
            '#CF1D49',
          ],
          positions: [0,0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
    console.log(layer)

  });
