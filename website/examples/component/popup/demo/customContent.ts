import * as G2 from '@antv/g2';
import { GaodeMap, LayerPopup, PointLayer, Scene } from '@antv/l7';

const data: any[] = [
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
];

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
    .source(data, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .color('value', ['#FFCCC6', '#CF1421'])
    .size(10)
    .shape('circle');
  scene.addLayer(pointLayer);

  const div = document.createElement('div');
  const chart = new G2.Chart({
    container: div,
    autoFit: true,
    width: 200,
    height: 200,
  });
  // 新建一个 view 用来单独渲染Annotation
  chart.coordinate('theta', {
    radius: 0.75,
    innerRadius: 0.5,
  });

  chart.scale('percent', {
    formatter: (val) => {
      val = val * 100 + '%';
      return val;
    },
  });

  chart.tooltip(false);

  // 声明需要进行自定义图例字段： 'item'
  chart.legend(false);

  chart
    .interval()
    .adjust('stack')
    .position('percent')
    .color('item', ['#5B8FF9', '#797979'])
    .style({
      fillOpacity: 1,
    });

  const layerPopup = new LayerPopup({
    items: [
      {
        layer: pointLayer,
        customContent: (e) => {
          const otherValue = 100 - e.value;
          chart.data([
            { item: '值', count: e.value, percent: e.value / 100 },
            { item: '', count: otherValue, percent: otherValue / 100 },
          ]);
          chart.render();
          return div;
        },
      },
    ],
  });

  scene.addPopup(layerPopup);
});
