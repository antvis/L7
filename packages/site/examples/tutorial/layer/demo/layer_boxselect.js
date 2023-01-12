import { PolygonLayer, LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [120.13618469238281, 30.247352897833554],
    zoom: 9,
  }),
});
scene.on('loaded', () => {
  fetch('https://geo.datav.aliyun.com/areas_v3/bound/330100_full.json')
    .then((res) => res.json())
    .then((data) => {
      const fillLayer = new PolygonLayer({
        name: 'fill',
        autoFit: true,
      })
        .source(data)
        .shape('fill')
        .color('adcode', [
          '#f0f9e8',
          '#ccebc5',
          '#a8ddb5',
          '#7bccc4',
          '#43a2ca',
          '#0868ac',
        ]);

      const lineLayer = new LineLayer({
        zIndex: 1,
        name: 'line',
      })
        .source(data)
        .shape('line')
        .size(1)
        .color('#fff');

      const selectLayer = new LineLayer({
        zIndex: 2,
        name: 'select',
      })
        .source([])
        .shape('line')
        .size(2)
        .color('#f00');

      scene.addLayer(fillLayer);
      scene.addLayer(lineLayer);
      scene.addLayer(selectLayer);

      scene.enableBoxSelect(false);

      const onBoxSelect = (bbox, startEvent, endEvent) => {
        const { x: x1, y: y1 } = startEvent;
        const { x: x2, y: y2 } = endEvent;
        fillLayer.boxSelect(
          [
            Math.min(x1, x2),
            Math.min(y1, y2),
            Math.max(x1, x2),
            Math.max(y1, y2),
          ],
          (features) => {
            selectLayer.setData({
              type: 'FeatureCollection',
              features: features ?? [],
            });
          },
        );
      };

      scene.on('selecting', onBoxSelect);
      scene.on('selectend', onBoxSelect);
    });
});
