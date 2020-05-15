import { Scene } from '@antv/l7';
import { CountyLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 116.2825, 39.9 ],
    pitch: 0,
    style: 'blank',
    zoom: 3,
    minZoom: 3,
    maxZoom: 10
  })
});
scene.on('loaded', () => {
  new CountyLayer(scene, {
    data: [],
    adcode: [ '110101', '110102', '110106' ],
    depth: 3,
    label: {
      field: 'NAME_CHN'
    },
    bubble: {
      enable: true,
      color: {
        field: 'NAME_CHN',
        values: [
          '#feedde',
          '#fdd0a2',
          '#fdae6b',
          '#fd8d3c',
          '#e6550d',
          '#a63603'
        ]
      }
    },
    popup: {
      enable: true,
      Html: props => {
        return `<span>${props.NAME_CHN}</span>`;
      }
    }
  });
});
