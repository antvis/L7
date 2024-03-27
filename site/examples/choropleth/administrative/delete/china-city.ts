import { GaodeMap, Scene } from '@antv/l7';
import { Choropleth } from '@antv/l7plot';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'blank',
    center: [120.19382669582967, 30.258134],
    zoom: 3,
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/administrative-data/area-list.json')
    .then((response) => response.json())
    .then((list) => {
      const data = list
        .filter(({ level }) => level === 'city')
        .map((item) => ({ ...item, value: Math.random() * 5000 }));

      const choropleth = new Choropleth({
        source: {
          data,
          joinBy: {
            sourceField: 'adcode',
            geoField: 'adcode',
          },
        },
        viewLevel: {
          level: 'country',
          adcode: 100000,
          granularity: 'city',
        },
        autoFit: true,
        color: {
          field: 'value',
          value: ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'],
          scale: { type: 'quantize' },
        },
        style: {
          opacity: 1,
          stroke: '#ccc',
          lineWidth: 0.6,
          lineOpacity: 1,
        },
        label: {
          visible: true,
          field: 'name',
          style: {
            fill: '#000',
            opacity: 0.8,
            fontSize: 10,
            stroke: '#fff',
            strokeWidth: 1.5,
            textAllowOverlap: false,
            padding: [5, 5],
          },
        },
        state: {
          active: { stroke: 'black', lineWidth: 1 },
        },
        tooltip: {
          items: ['name', 'adcode', 'value'],
        },
        zoom: {
          position: 'bottomright',
        },
        legend: {
          position: 'bottomleft',
        },
      });

      choropleth.addToScene(scene);
    });
});

// {
//   "filename": "china-city.ts",
//   "title": {
//     "zh": "中国市级地图",
//     "en": "China Citys Map"
//   },
//   "screenshot": "https://gw.alipayobjects.com/zos/antfincdn/GN35RftkmZ/c53bc5ab-189f-42a2-9288-7b34f616f18d.png"
// },
