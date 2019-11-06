import { Scene } from '@l7/scene';
import { PolygonLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'dark',
  center: [121.40, 31.258134],
  zoom: 3,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new PolygonLayer({
        enablePicking: true,
        enableHighlight: true,
        highlightColor: 'red',
        onHover: (pickedFeature) => {
          // tslint:disable-next-line:no-console
          console.log(pickedFeature);
        },
      })
      .source(data)
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
  });


