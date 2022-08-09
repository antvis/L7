import { Scene, PointLayer, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 0,
    style: 'dark',
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/87e40417-a5da-4fdb-8313-c796ea15f982.csv')
    .then(res => res.text())
    .then(data => {
      const dataSource = new Source(data, {
        parser: {
          type: 'csv',
          x: 'lng',
          y: 'lat'

        },
        cluster: true
      });
      const pointLayer = new PointLayer({
        autoFit: true
      })
        .source(dataSource)
        .shape('circle')
        .scale('point_count', {
          type: 'quantile'
        })
        .size('point_count', [ 5, 10, 15, 20, 25 ])
        .active(true)
        .color('rgb(73,167,86)')
        .style({
          opacity: 1,
          strokeWidth: 1,
          stroke: '#fff'
        });

      // 聚合图标注
      const pointLayerText = new PointLayer({
        autoFit: false
      })
        .source(dataSource)
        .shape('point_count', 'text')
        .size(15)
        .active(true)
        .color('#fff')
        .style({
          opacity: 1,
          strokeWidth: 0,
          stroke: '#fff'

        });

      scene.addLayer(pointLayer);
      scene.addLayer(pointLayerText);
    });
});
