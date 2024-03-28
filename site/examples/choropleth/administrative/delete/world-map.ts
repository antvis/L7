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

const choropleth = new Choropleth({
  source: {
    data: [],
    joinBy: {
      sourceField: 'code',
      geoField: 'adcode',
    },
  },
  viewLevel: {
    level: 'world',
    adcode: 'all',
  },
  autoFit: true,
  color: {
    field: 'name',
    value: ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'],
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
    active: true,
    select: {
      stroke: 'black',
      lineWidth: 1.5,
      lineOpacity: 0.8,
    },
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

scene.on('loaded', () => {
  choropleth.addToScene(scene);
});

// {
//   "filename": "world-map.ts",
//   "title": {
//     "zh": "世界地图",
//     "en": "World Map"
//   },
//   "screenshot": "https://gw.alipayobjects.com/zos/antfincdn/2W6xl7Y3wm/e7590fc4-f49b-43c0-ba3b-8b40a9ac3b39.png"
// },
