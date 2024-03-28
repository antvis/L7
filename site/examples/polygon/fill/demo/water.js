import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [-44.40673828125, -18.375379094031825],
    zoom: 13,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json')
    .then((data) => data.json())
    .then(({ lakeData }) => {
      const lakeLayer = new PolygonLayer({ autoFit: true })
        .source(lakeData)
        .shape('water')
        .color('#1E90FF')
        .style({
          speed: 0.4,
          // waterTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'
        })
        .animate(true);

      scene.addLayer(lakeLayer);
    });
});
