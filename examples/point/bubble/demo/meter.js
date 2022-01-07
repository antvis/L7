import {
  Scene,
  PointLayer
} from '@antv/l7';
import {
  GaodeMapV2
} from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    pitch: 0,
    type: 'amap',
    style: 'light',
    center: [ 101.69, 30.26 ],
    zoom: 5
  })
});

// 建国以来中国周围6.0M 的地震信息
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/032592a2-8960-4022-a91c-cc67bd4c92a4.json'
  )
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        })
        .shape('circle')
        // 注:开启等面积模式 size 要设置足够大,负责太小看不到效果
        .size(100000)
        .active(true)
        .animate(true)
        .color('m', m => {
          if (+m >= 6 && +m < 7) {
            return 'blue';
          }
          if (+m >= 7 && +m < 8) {
            return 'orange';
          }
          if (+m >= 8) {
            return 'red';
          }
        })
        .style({
          unit: 'meter'
        });
      scene.addLayer(pointLayer);

      const textLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        })
        .shape('m', 'text')
        .size(10)
        .color('#000')
        .style({
          textAnchor: 'center'
        });
      scene.addLayer(textLayer);
    });
});
