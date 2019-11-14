import { HeatMapHexagonLayer, HeatMapGrid3dLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 43,
  center: [119.9719107,29.4924299],
  zoom: 7.2,
  type: 'mapbox',
});
window.mapScene = scene;
const colorObj = {
  redyellow: [
    '#8A191A', '#AE3235',
    '#CC464B', '#E26A5D',
    '#EC8765', '#F0A66C',
    '#F4BC8F', '#FFCEA7',
    '#FFE4CE', '#FFF2E8'
  ],
  yellow: [
    '#7B320A', '#B35B21',
    '#D2722E', '#F0883A',
    '#FBA045', '#FAB04B',
    '#FAC760', '#FBD78C',
    '#FCE6B3', '#FCF3DB'
  ],
  blue_green: [
    '#094D4A', '#146968',
    '#1D7F7E', '#289899',
    '#34B6B7', '#4AC5AF',
    '#5FD3A6', '#7BE39E',
    '#A1EDB8', '#CEF8D6'
  ],
  blue: [
    '#0A3663', '#1558AC',
    '#3771D9', '#4D89E5',
    '#64A5D3', '#72BED6',
    '#83CED6', '#A6E1E0',
    '#B8EFE2', '#D7F9F0'
  ],
  purple: [
    '#312B60', '#4A457E',
    '#615C99', '#816CAD',
    '#A67FB5', '#C997C7',
    '#DEB8D4', '#F5D4E6',
    '#FAE4F1', '#FFF3FC'
  ],
  color1: [
    '#E4682F', '#FF8752',
    '#FFA783', '#FFBEA8',
    '#FFDCD6', '#EEF3FF',
    '#C8D7F5', '#A5C1FC',
    '#7FA7F9', '#5F8AE5'
  ],
  color2: [
    '#F1646A', '#F48789',
    '#F7A9AC', '#FBCCCD',
    '#FDEEEE', '#EEF3FF',
    '#C8DAFE', '#A5C1FC',
    '#80A8FB', '#5B8EF8'
  ],
  color3: [
    '#EEF3FF', '#C8DAFE',
    '#A5C1FC', '#80A8FB',
    '#5B8EF8', '#FCF6FA',
    '#F5E4EF', '#F7CDDF',
    '#ED9CBE', '#D1749B'
  ],
  color4: [ '#421EB2', '#8C1EB2', '#F27DEB', '#FFF598', '#F7B74A', '#FF4818' ],
  colors6: [ '#FBE0B2', '#F6BB91', '#F88E8B', '#5C6CE5', '#110A6C', '#0D0943' ],
  colors5: [ '#F86A7E', '#F79794', '#D0A8AD', '#8596A4', '#0D7D9E', '#07485B' ],
  colors11: [ '#005F6D', '#0F9EA3', '#B9CDC5', '#DF881C', '#AE571E', '#6C2C03' ],
  colors7: [ '#D66A74', '#EF808B', '#F09FAF', '#B1C987', '#789676', '#636C58' ],
  colors8: [ '#5E023A', '#C52C6A', '#F0C4E8', '#F7CAB8', '#7EBCA9', '#117D8D' ],
  colors9: [ '#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C' ]
}
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv',
)
  .then((res) => res.text())
  .then((data) => {
    const layer = new HeatMapGrid3dLayer({})
      .source(data, {

        parser:{
           type:'csv',
            x:'lng',
            y:'lat',
        },
        transforms: [
          {
            type: 'hexagon',
            size: 2500,
            field: 'v',
            method: 'sum',
          },
        ],
      })
      .size('sum', (sum)=>{
        return sum * 200;
      })
      .shape('hexagon')
      .style({
        coverage: 0.8,
        angle: 0,
        opacity: 1.0,
      })
      .color(
        'sum',
        colorObj.blue.slice(0,7).reverse(),
      );
    scene.addLayer(layer);
    console.log(layer);
  });
