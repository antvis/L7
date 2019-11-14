import { Scene } from '@l7/scene';
import { PointLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  type: 'amap',
  style: 'light',
  center: [-122.80009283836715, 37.05881309947238],
  pitch: 0,
  zoom: 5.740491857794806
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
fetch('https://gw.alipayobjects.com/os/basement_prod/6c4bb5f2-850b-419d-afc4-e46032fc9f94.csv')
  .then((res) => res.text())
  .then((data) => {
    const pointLayer =
      new PointLayer({
      })
        .source(data,{
          parser:{
            type:'csv',
            x:'Longitude',
            y:'Latitude'
          }
        })
        .shape('circle')
        .size(4)
        .color('Magnitude',colorObj.yellow)
        .style({
          opacity: 0.5,
          strokeWidth: 0,
        })

        scene.addLayer(pointLayer);

  });


