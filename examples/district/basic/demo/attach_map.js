import { Scene } from '@antv/l7';
import { CountryLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';
const colors = [ '#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70' ];
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 116.2825, 39.9 ],
    pitch: 0,
    style: 'blank',
    zoom: 3,
    minZoom: 0,
    maxZoom: 10
  })
});
const attachMapContainer = document.createElement('div');
attachMapContainer.id = 'attach';
attachMapContainer.style.cssText = `position: absolute;
height: 125px;
width: 98px;
right: 50px;
bottom: 20px;
border: 1px solid #333;`;
document.getElementById('map').parentElement.append(attachMapContainer);

scene.on('loaded', () => {
  new CountryLayer(scene, {
    data: [],
    joinBy: [ 'NAME_CHN', 'name' ],
    depth: 1,
    provinceStroke: '#fff',
    cityStroke: '#EBCCB4',
    cityStrokeWidth: 1,
    label: {
      enable: false
    },
    fill: {
      color: {
        field: 'NAME_CHN',
        values: colors
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

// 添加附图，附图需要和主图保持一致

const scene2 = new Scene({
  id: 'attach',
  logoVisible: false,
  map: new Mapbox({
    center: [ 113.60540108435657, 12.833692637803168 ],
    pitch: 0,
    style: 'blank',
    zoom: 1.93,
    minZoom: 0,
    maxZoom: 3,
    interactive: false
  })
});
scene2.on('loaded', () => {
  new CountryLayer(scene2, {
    data: [],
    label: {
      enable: false
    },
    popup: {
      enable: false
    },
    autoFit: false,
    depth: 1,
    fill: {
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
    }
  });
});
