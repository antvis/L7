import { Scene, LineLayer, PointLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';


const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 120.12331008911133, 30.235933812981585 ],
    zoom: 11.5,
    style: 'dark'
  })
});
scene.on('loaded', async () => {
  scene.addImage(
    '00',
    'https://gw.alipayobjects.com/zos/bmw-prod/dc88a510-cc3b-43c3-b8d0-eace13892921.svg'
  );
  scene.addImage(
    '01',
    'https://gw.alipayobjects.com/zos/bmw-prod/079694c9-2799-498b-8557-c5ab5e755edc.svg'
  );

  const [ pathLine, points ] = await Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/0687cc9e-f1b3-47f2-b7d0-33e62be85658.json'
    ).then(res => res.json()),
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/d0f3fea1-facb-4269-bb7b-e2ed76a6d91b.json'
    ).then(res => res.json())
  ]);

  const lineLayer = new LineLayer()
    .source(pathLine)
    .size(3)
    .shape('line')
    .color('#20B2AA')
    .animate({
      interval: 0.6,
      trailLength: 1.5,
      duration: 6
    })
    .style({
      borderWidth: 0.45,
      borderColor: '#fff'
    });
  scene.addLayer(lineLayer);

  const circleLayer = new PointLayer()
    .source(points)
    .size(20)
    .shape('01')
    .style({
      offsets: [ 0, -5 ]
    });
  scene.addLayer(circleLayer);

  const pointLayer = new PointLayer()
    .source(points)
    .size(10)
    .active(true)
    .shape('00');
  scene.addLayer(pointLayer);

  const textLayer = new PointLayer()
    .source(points)
    .size(11)
    .shape('name', 'text')
    .color('white')
    .active(true)
    .style({
      textAnchor: 'center',
      textOffset: [ 10, -65 ]
    });
  scene.addLayer(textLayer);

});
