
import { Scene, PolygonLayer, LineLayer, PointLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'blank',
    center: [ 116.368652, 39.93866 ],
    zoom: 10.07
  })
});
scene.on('loaded', () => {
  fetch(
    //'https://gw.alipayobjects.com/os/bmw-prod/1981b358-28d8-4a2f-9c74-a857d5925ef1.json' //  获取行政区划P噢利用
    'https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json'
  )
    .then(res => res.json())
    .then(data => {
      const chinaPolygonLayer = new PolygonLayer({
        autoFit: true
      })
        .source(data)
        .color(
          'name',
          [
            'rgb(239,243,255)',
            'rgb(189,215,231)',
            'rgb(107,174,214)',
            'rgb(49,130,189)',
            'rgb(8,81,156)'
          ]
        )
        .shape('fill')
        .style({
          opacity: 1
        });
        //  图层边界
      const layer2 = new LineLayer({
        zIndex: 2
      })
        .source(data)
        .color('rgb(93,112,146)')
        .size(0.6)
        .style({
          opacity: 1
        });

      scene.addLayer(chinaPolygonLayer);
      scene.addLayer(layer2);
    });
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/c4a6aa9d-8923-4193-a695-455fd8f6638c.json' //  标注数据
  ).then(res => res.json())
    .then(data => {
      const labelLayer = new PointLayer({
        zIndex: 5
      })
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'center'
          }
        })
        .color('#fff')
        .shape('name', 'text')
        .size(12)
        .style({
          opacity: 1,
          stroke: '#fff',
          strokeWidth: 0,
          padding: [ 5, 5 ],
          textAllowOverlap: false
        });

      scene.addLayer(labelLayer);
    });
});
