import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const mapWrap = document.getElementById('map');
const { left, top } = mapWrap.getBoundingClientRect();
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [110, 30],
    zoom: 2.5,
    style: 'dark',
    dragEnable: false,
  }),
});
const emptyFeatureCollextion = {
  type: 'FeatureCollection',
  features: [],
};

function getSelectData(data) {
  return [
    Math.min(data[0], data[2]), // x1
    Math.min(data[1], data[3]), // y1
    Math.max(data[0], data[2]), // x2
    Math.max(data[1], data[3]), // y2
  ];
}

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json')
    .then((res) => res.json())
    .then((data) => {
      const chinaPolygonLayer = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .color('name', [
          'rgb(239,243,255)',
          'rgb(189,215,231)',
          'rgb(107,174,214)',
          'rgb(49,130,189)',
          'rgb(8,81,156)',
        ])
        .shape('fill');

      //  图层边界
      const chinaBorderLineLayer = new LineLayer({
        zIndex: 2,
      })
        .source(data)
        .color('rgb(93,112,146)')
        .size(0.6);

      const selectLineLayer = new LineLayer({
        zIndex: 2,
      })
        .source(emptyFeatureCollextion)
        .color('#fff')
        .size(2);

      const boxLayer = new PolygonLayer({})
        .source(emptyFeatureCollextion)
        .color('#fff')
        .size(2)
        .style({
          opacity: 0.6,
          lineType: 'dash',
          dashArray: [5, 5],
        })
        .shape('line');

      chinaPolygonLayer.on('unclick', () => {
        selectLineLayer.setData(emptyFeatureCollextion);
      });

      scene.addLayer(chinaPolygonLayer);
      scene.addLayer(chinaBorderLineLayer);
      scene.addLayer(selectLineLayer);
      scene.addLayer(boxLayer);

      let startLngLat = { lng: 0, lat: 0, x: 0, y: 0 };
      const selectNames = '';

      scene.on('dragstart', (e) => {
        selectLineLayer.setData(emptyFeatureCollextion);
        startLngLat = {
          ...e.lngLat,
          x: e.target.x,
          y: e.target.y,
        };
      });

      scene.on('dragging', (e) => {
        const { lng: startLng, lat: startLat } = startLngLat;
        const { lng: endLng, lat: endLat } = e.lngLat;

        boxLayer.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [startLng, endLat],
                    [endLng, endLat],
                    [endLng, startLat],
                    [startLng, startLat],
                    [startLng, endLat],
                  ],
                ],
              },
            },
          ],
        });
      });

      scene.on('dragend', (e) => {
        const { x: startX, y: startY } = startLngLat;
        const { x: endX, y: endY } = e.target;
        boxLayer.setData(emptyFeatureCollextion);
        const selectData = [startX - left, startY - top, endX - left, endY - top];
        chinaPolygonLayer.boxSelect(getSelectData(selectData), (features) => {
          const currentSelectNames = features.map((item) => item.properties.name).join(',');
          if (currentSelectNames !== selectNames) {
            selectLineLayer.setData({
              type: 'FeatureCollection',
              features: [...features],
            });
          }
        });
      });
    });
});

// {
//   "filename": "box_select.js",
//   "title": "框选要素",
//   "screenshot":"https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*G1lyQ6e5gKAAAAAAAAAAAAAAARQnAQ"
// },
