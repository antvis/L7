import { Scene, CityBuildingLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 120.173104, 30.244072 ],
    pitch: 66.50572,
    zoom: 15.79,
    minZoom: 10,
    maxZoom: 18
  })
});

scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new CityBuildingLayer(
        {
          zIndex: 0
        }
      );
      layer
        .source(data)
        .size('floor', [ 100, 3000 ])
        .color('rgba(242,246,250,1.0)')
        .animate({
          enable: true
        })
        .style({
          opacity: 1.0,
          baseColor: 'rgb(16,16,16)',
          windowColor: 'rgb(30,60,89)',
          brightColor: 'rgb(255,176,38)'
        });
      scene.addLayer(layer);
    });
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({
        zIndex: 0
      })
        .source(data)
        .size(1)
        .shape('line')
        .color('#ff893a')
        .animate({
          interval: 1, // 间隔
          duration: 2, // 持续时间，延时
          trailLength: 2 // 流线长度
        });
      scene.addLayer(layer);
    });

});

