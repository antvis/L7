import { GaodeMap, LayerPopup, PointLayer, Scene } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
  logoVisible: false,
});
scene.on('loaded', () => {
  const pointLayer = new PointLayer({});
  pointLayer
    .source(
      [
        {
          lng: 120.132235,
          lat: 30.250868,
          value: 34.71314604052238,
          name: '坐标点1',
        },
        {
          lng: 120.156236,
          lat: 30.260268,
          value: 96.807880210153,
          name: '坐标点2',
        },
        {
          lng: 120.163014,
          lat: 30.251297,
          value: 29.615472482876815,
          name: '坐标点3',
        },
        {
          lng: 120.15394,
          lat: 30.231489,
          value: 49.90316258911784,
          name: '坐标点4',
        },
        {
          lng: 120.154596,
          lat: 30.24065,
          value: 45.788587061188466,
          name: '坐标点5',
        },
        {
          lng: 120.150223,
          lat: 30.235078,
          value: 29.741111717098544,
          name: '坐标点6',
        },
        {
          lng: 120.143992,
          lat: 30.229411,
          value: 40.241555782182935,
          name: '坐标点7',
        },
        {
          lng: 120.136995,
          lat: 30.237439,
          value: 86.5369792415296,
          name: '坐标点8',
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .color('value', ['#FFCCC6', '#CF1421'])
    .size(10)
    .shape('circle');
  scene.addLayer(pointLayer);
  const layerPopup = new LayerPopup({
    items: [
      {
        layer: pointLayer,
        fields: [
          {
            field: 'name',
            formatField: () => '名称',
          },
          {
            field: 'value',
            formatField: () => '权值',
            formatValue: (val) => val.toFixed(2),
          },
          'lng',
          'lat',
        ],
      },
    ],
  });

  scene.addPopup(layerPopup);
});
