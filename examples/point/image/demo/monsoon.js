import { Scene, PointLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'dark',
    center: [ 105, 35 ],
    zoom: 2.5
  })
});


scene.addImage(
  'arrRed',
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KWGqT6Oz50EAAAAAAAAAAAAAARQnAQ'
);
scene.addImage(
  'arrBlue',
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ZKhURq53OgIAAAAAAAAAAAAAARQnAQ'
);

scene.on('loaded', () => {

  fetch('https://gw.alipayobjects.com/os/bmw-prod/4c02515b-cb7a-47be-93cf-5596731ef982.json')
    .then(res => res.json())
    .then(monsoon => {
      const { data, borderData } = monsoon;
      const imageLayer = new PointLayer()
        .source(data)
        .shape('wind', wind => {
          if (wind === 'up') {
            return 'arrBlue';
          }
          return 'arrRed';

        })
        .rotate('r', r => Math.PI * r)
        .size(15)
        .style({
          rotation: 0,
          layerType: 'fillImage'
        });
      scene.addLayer(imageLayer);


      const border = new LineLayer()
        .source(borderData)
        .size(1.5)
        .color('#575757')
        .style({
          lineType: 'dash',
          dashArray: [ 5, 5 ]
        });
      scene.addLayer(border);

      const text = new PointLayer({ zIndex: 2 })
        .source([
          { lng: 90, lat: 35, n: '非季风区' },
          { lng: 125, lat: 30, n: '季风区' }
        ], {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('n', 'text')
        .size(25)
        .color('#575757')
        .style({
          spacing: 20
        });

      scene.addLayer(text);
    });


});
