import { Scene } from '@antv/l7';
import { ProvinceLayer, CountryLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';
async function initMap() {
  const scene = new Scene({
    id: 'map',
    map: new Mapbox({
      center: [ 109.803, 19.347 ],
      pitch: 0,
      style: 'blank',
      zoom: 7,
      minZoom: 6,
      maxZoom: 11
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
    new ProvinceLayer(scene, {
      data: [],
      geoDataLevel: 1,
      autoFit: false,
      joinBy: [ 'adcode', 'code' ],
      adcode: [ '460000' ],
      depth: 2,
      stroke: '#aaa',
      label: {
        enable: false,
        field: 'NAME_CHN',
        textAllowOverlap: false
      },
      fill: {
        color: '#A3d7FF'
      },
      popup: {
        enable: false,
        Html: props => {
          return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
        }
      }
    });
  });

  const scene2 = new Scene({
    id: 'attach',
    logoVisible: false,
    map: new Mapbox({
      center: [ 113.60540108435657, 12.833692637803168 ],
      pitch: 0,
      style: 'blank',
      zoom: 1.93,
      // zoom: 3,
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
      provinceStroke: '#aaa',
      depth: 1,
      fill: {
        color: '#A3d7FF'
      }
    });
    new ProvinceLayer(scene2, {
      data: [],
      autoFit: false,
      adcode: [ '460000' ],
      depth: 2,
      zIndex: 2,
      stroke: '#aaa',
      strokeWidth: 0.1,
      label: {
        enable: false,
        field: 'NAME_CHN',
        textAllowOverlap: false
      },
      fill: {
        color: '#A3d7ff'
      },
      popup: {
        enable: false,
        Html: props => {
          return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
        }
      }
    });
  });
}
initMap();
