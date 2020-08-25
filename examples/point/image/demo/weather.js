import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 120.5969, 29.7918 ],
    pitch: 35,
    zoom: 7,
    rotation: 4.183582
  })
});
scene.on('loaded', () => {
  scene.addImage(
    '00',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*kzTMQqS2QdUAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '01',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*jH1XRb7F7hMAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '02',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*YaKSTr3L5i8AAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '04',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*dmniQrDpCYwAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '11',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*YaKSTr3L5i8AAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '15',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*YNlXQYCIzroAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '07',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*DccRTI6ZRLoAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '16',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iQKoS6I-rO8AAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '06',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*f-wyS7ad5p0AAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '08',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*lHhzQrOW4AQAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '17',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*9Q0QS4GdaYcAAAAAAAAAAABkARQnAQ'
  );
  scene.addImage(
    '05',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*LyuVRowl6nAAAAAAAAAAAABkARQnAQ'
  );
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/c6042c6b-45fd-4e2e-adf8-fdbf060441e8.json'
  )
    .then(res => res.json())
    .then(data => {
      const imageLayer = new PointLayer()
        .source(data)
        .shape('w', function(w) {
          return w;
        })
        .size(15);
      scene.addLayer(imageLayer);
    });
});
