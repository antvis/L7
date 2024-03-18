import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 7.65, 45.053 ],
    zoom: 12,
    style: 'dark'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/98a5d9ec-be97-44bd-bff0-5742d929c003.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data)
        .shape('line')
        .color('highway', v => {
          switch (v) {
          case 'motorway':
            return '#F9D371';
          case 'motorway_link':
            return '#3DB2FF';
          case 'trunk':
            return 'green';
          case 'trunk_link':
            return '#6E85B2';
          case 'primary':
            return '#F47340';
          case 'primary_link':
            return '#F6A9A9';
          case 'secondary':
            return '#EF2F88';
          case 'secondary_link':
            return '#5F7A61';
          case 'tertiary':
            return '#1ee3cf';
          case 'tertiary_link':
            return '#C2F784';
          case 'pedestrian':
            return '#FFF89A';
          case 'residential':
            return 'rgba(22, 119, 255, .5)';
          case 'road':
            return '#93FFD8';
          case 'path':
            return '#BAFFB4';
          case 'unclassified':
            return '#D3DEDC';
          case 'service':
            return '#AEFEFF';
          case 'living_street':
            return '#9B0000';
          case 'track':
            return '#F5F5F5';
          case 'highway':
            return 'red';
          case 'rail':
            return '#08ffc8';
          default:
            return '#FFE3E3';
          }
        })
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2 // 流线长度
        });
      scene.addLayer(layer);
    });
});

