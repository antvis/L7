import { Scene, CityBuildingLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [ 121.507674, 31.223043 ],
    pitch: 65.59312320916906,
    zoom: 15.4,
    minZoom: 15,
    maxZoom: 18
  })
});

fetch(
  'https://gw.alipayobjects.com/os/rmsportal/vmvAxgsEwbpoSWbSYvix.json'
)
  .then(res => res.json())
  .then(data => {
    const layer = new CityBuildingLayer();
    layer
      .source(data)
      .size('floor', [ 0, 500 ])
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
