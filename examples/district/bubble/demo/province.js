import { Scene } from '@antv/l7';
import { ProvinceLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';
async function initMap() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/149b599d-21ef-4c24-812c-20deaee90e20.json'
  );
  const provinceData = await response.json();
  const data = Object.keys(provinceData).map(key => {
    return {
      code: key,
      name: provinceData[key][0],
      pop: provinceData[key][2] * 1
    };
  });

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
    new ProvinceLayer(scene, {
      data,
      joinBy: [ 'adcode', 'code' ],
      adcode: [ '330000' ],
      depth: 3,
      label: {
        field: 'NAME_CHN',
        textAllowOverlap: false
      },
      bubble: {
        enable: true,
        color: {
          field: 'pop',
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
          return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
        }
      }
    });
  });
}
initMap();
