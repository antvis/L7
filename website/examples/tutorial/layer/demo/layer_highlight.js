import { PolygonLayer, LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 118.7368, 32.0560 ],
    zoom: 9
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/91247d10-585b-4406-b1e2-93b001e3a0e4.json'
  )
    .then(res => res.json())
    .then(data => {
      const filllayer = new PolygonLayer({
        name: 'fill'
      })
        .source(data)
        .shape('fill')
        .color('unit_price', [ '#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac' ]);
      const linelayer = new LineLayer({
        zIndex: 1,
        name: 'line'
      })
        .source(data)
        .shape('line')
        .size(0.5)
        .color('#fff')
        .style({
          opacity: 0.5
        });
      const hightLayer = new LineLayer({
        zIndex: 4, // 设置显示层级
        name: 'hightlight'
      })
        .source({
          type: 'FeatureCollection',
          features: [ ]
        })
        .shape('line')
        .size(2)
        .color('red');
      scene.addLayer(filllayer);
      scene.addLayer(linelayer);
      scene.addLayer(hightLayer);
      filllayer.on('click', feature => {
        console.log(feature);
        hightLayer.setData({
          type: 'FeatureCollection',
          features: [ feature.feature ]
        });
      });
    });
});
