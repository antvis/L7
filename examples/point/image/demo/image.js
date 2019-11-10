import { Scene } from '@l7/scene';
import { PointImageLayer } from '@l7/layers'
console.log(this);
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [121.40, 31.258134],
  zoom: 15,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then((res) => res.json())
  .then((data) => {
  scene.addImage(
    '00',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*Rq6tQ5b4_JMAAAAAAAAAAABkARQnAQ',
  );
  scene.addImage(
    '01',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*0D0SQ6AgkRMAAAAAAAAAAABkARQnAQ',
  );
  scene.addImage(
    '02',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*o16fSIvcKdUAAAAAAAAAAABkARQnAQ',
  );
   const imageLayer = new PointImageLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('name', ['00', '01','02'])
      .size(20);
        scene.addLayer(imageLayer);
  });


