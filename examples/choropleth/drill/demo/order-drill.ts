import { Scene, Mapbox } from '@antv/l7';
import { Choropleth } from '@antv/l7plot';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [120.19382669582967, 30.258134],
    zoom: 3,
    pitch: 0,
  }),
});

fetch(
  `https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/administrative-data/area-list.json`,
)
  .then((response) => response.json())
  .then((list) => {
    const data = list
      .filter(({ level }) => level === 'province')
      .map((item) => Object.assign({}, item, { value: Math.random() * 5000 }));

    const cityData = list
      .filter(({ level }) => level === 'city')
      .map((item) => Object.assign({}, item, { value: Math.random() * 2000 }));

    const districtData = list
      .filter(({ level }) => level === 'district')
      .map((item) => Object.assign({}, item, { value: Math.random() * 1000 }));

    const choropleth = new Choropleth({
      source: {
        data: data,
        joinBy: {
          sourceField: 'adcode',
          geoField: 'adcode',
        },
      },
      viewLevel: {
        level: 'country',
        adcode: 100000,
      },
      autoFit: true,
      drill: {
        steps: [
          {
            level: 'province',
            source: { data: cityData },
          },
          {
            level: 'city',
            source: { data: districtData },
          },
          {
            level: 'district',
            source: { data: districtData },
            // color: 'green',
            // style: { opacity: 0.5 },
          },
        ],
        triggerUp: 'unclick',
        triggerDown: 'click',
      },
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

    if (scene.loaded) {
      choropleth.addToScene(scene);
    } else {
      scene.on('loaded', () => {
        choropleth.addToScene(scene);
      });
    }
  });
