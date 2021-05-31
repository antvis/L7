import { Scene, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.115, 30.221 ],
    pitch: 40,
    zoom: 16,
    viewMode: '3D'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/91d27a97-869a-459b-a617-498dcc9c3e7f.json'
  )
    .then(res => res.json())
    .then(data => {

      scene.addImage(
        'road',
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*haGlTpW2BQgAAAAAAAAAAAAAARQnAQ'
      );

      const layer = new LineLayer()
        .source(data)
        .size(8)
        .shape('line')
        .texture('road')
        .color('rgb(20, 180, 90)')
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2 // 流线长度
        })
        .style({
          lineTexture: true, // 开启线的贴图功能
          iconStep: 200 // 设置贴图纹理的间距
        });
      scene.addLayer(layer);

      scene.addImage(
        'start',
        'https://gw.alipayobjects.com/zos/bmw-prod/ebb0af57-4a8a-46e0-a296-2d51f9fa8007.svg'
      );
      scene.addImage(
        'visitor',
        'https://gw.alipayobjects.com/zos/bmw-prod/64db255d-b636-4929-b072-068e75178b23.svg'
      );
      scene.addImage(
        'museum',
        'https://gw.alipayobjects.com/zos/bmw-prod/0630591d-64db-4057-a04d-d65f43aebf0f.svg'
      );
      scene.addImage(
        'supermarket',
        'https://gw.alipayobjects.com/zos/bmw-prod/ab42799d-dea6-4d37-bd62-3ee3e06bf6c0.svg'
      );
      scene.addImage(
        'tower',
        'https://gw.alipayobjects.com/zos/bmw-prod/6d27cf89-638c-432b-a8c4-cac289ee98a8.svg'
      );
      scene.addImage(
        'end',
        'https://gw.alipayobjects.com/zos/bmw-prod/59717737-5652-479f-9e6b-e7d2c5441446.svg'
      );
      const imageLayer = new PointLayer()
        .source([{
          lng: 120.11025885601617,
          lat: 30.22006389085372,
          icon: 'start'
        }, {
          lng: 120.11123578376913,
          lat: 30.220443561196277,
          icon: 'visitor'
        }, {
          lng: 120.11408457779198,
          lat: 30.22019805564678,
          icon: 'museum'
        }, {
          lng: 120.11683172384723,
          lat: 30.21875509667716,
          icon: 'supermarket'
        }, {
          lng: 120.11945546294194,
          lat: 30.218724022876376,
          icon: 'tower'
        }, {
          lng: 120.1184189041221,
          lat: 30.21783201718256,
          icon: 'end'
        }
        ], {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('icon', [ 'start', 'visitor', 'museum', 'supermarket', 'tower', 'end' ])
        .size(35)
        .style({
          offsets: [ 0, 20 ]
        });
      scene.addLayer(imageLayer);
    });
});
