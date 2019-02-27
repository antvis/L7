import { expect } from 'chai';
import hexagonBuffer from '../../../../../src/geom/buffer/heatmap/hexagon';
describe('hexagon  heatMap  buffer', () => {
  const layerData = [
    { color: [ 1, 1, 0, 1 ], coordinates: [ 120.12063099925889, 30.263947783103486, 0 ], id: 1 },
    { color: [ 1, 0.5, 0, 1 ], coordinates: [ 120.12218696039365, 30.263947783103486, 0 ], id: 2 },
    {
      color: [ 1, 0.1, 0, 1 ],
      coordinates: [ 120.12374292152843, 30.263947783103486, 0 ],
      id: 3
    },
    { color: [ 1, 0, 0.2, 1 ], coordinates: [ 120.1252988826632, 30.263947783103486, 0 ], id: 4 },
    {
      color: [ 0, 1, 0, 1 ],
      coordinates: [ 120.12607686323062, 30.263947783103486, 0 ],
      id: 5
    },
    {
      color: [ 1, 1, 0, 1 ],
      coordinates: [ 120.12685484379799, 30.263947783103486, 0 ],
      id: 6
    },
    { color: [ 1, 1, 1, 1 ], coordinates: [ 120.12841080493274, 30.263947783103486, 0 ], id: 7 },
    { color: [ 0, 1, 1, 1 ], coordinates: [ 120.13230070776972, 30.263947783103486, 0 ], id: 8 },
    { color: [ 0, 1, 0, 1 ], coordinates: [ 120.12763282436538, 30.263947783103486, 0 ], id: 9 },
    { color: [ 1, 1, 0, 1 ], coordinates: [ 120.12996676606754, 30.263947783103486, 0 ], id: 10 }
  ];
  it('hexagon buffer', () => {
    const attribute = hexagonBuffer(layerData);
    expect(attribute.colors.length).eql(480);
    expect(attribute.miter.length).eql(240);
    expect(attribute.pickingIds.length).eql(120);
    expect(attribute.vertices.length).eql(360);
  });
});
