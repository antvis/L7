import { Scene } from '@l7/scene';
import { PointLayer, PointImageLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'dark',
  center: [121.40, 31.258134],
  zoom: 1,
  maxZoom: 10
});

fetch('https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json')
  .then((res) => res.json())
  .then((data) => {
    const pointLayer =
        new PointLayer({
        })
        .source(data).shape('circle')
        .size('capacity', [0, 20])
        .color('status', ['#ced1cc','#ffc83e','#ff8767','#dd54b6','#a45edb'])
        .style({
          opacity: 0.3,
          strokeWidth: 1,

        })

        scene.addLayer(pointLayer);

  });


