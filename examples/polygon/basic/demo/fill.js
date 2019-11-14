import { Scene } from '@l7/scene';
import { PolygonLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [116.3237, 39.8829],
  zoom: 8
});
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
  ]
}

fetch('https://gw.alipayobjects.com/os/basement_prod/1d27c363-af3a-469e-ab5b-7a7e1ce4f311.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new PolygonLayer({
      })
      .source(data)
       .color('unit_price', colorObj.blue_green)
       .shape('fill')
       .style({
        opacity: 1
      })
    scene.addLayer(layer);
    console.log(layer);
  });
