import PolygonLayer from '../index';
import { TestScene } from '@antv/l7-test-utils';
describe('PolygonLayer', () => {
  let scene: any;
  let layer: any;
  const data = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
            base_height:100,
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [119.948198, 30.339818],
              [120.344273, 30.513865],
              [120.414729, 30.288859],
              [120.346177, 30.160522],
              [120.100535, 30.041909],
              [119.906306, 30.094644],
              [119.845646, 30.175339],
              [119.81137, 30.244454],
              [119.807562, 30.352965],
              [119.948198, 30.339818]
            ]
          ]
        }
      }
    ]
  }

  beforeEach(() => {
      scene = TestScene();

  });


  it('PolygonLayer fill', () => {
      const layer = new PolygonLayer({})
      .source({
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [119.948198, 30.339818],
                  [120.344273, 30.513865],
                  [120.414729, 30.288859],
                  [120.346177, 30.160522],
                  [120.100535, 30.041909],
                  [119.906306, 30.094644],
                  [119.845646, 30.175339],
                  [119.81137, 30.244454],
                  [119.807562, 30.352965],
                  [119.948198, 30.339818]
                ]
              ]
            }
          }
        ]
      }
      
      )
      .size(0.5)
      .shape('fill')
      .active(true)
      .color('red');
      scene.addLayer(layer);

  });
  it('PolygonLayer extrude', () => {
    const layer = new PolygonLayer({})
    .source(data)
    .size(1000)
    .shape('extrusion')
    .active(true)
    .color('red')
    .style({
        extrusionBase:{
          field:'base_height',
        },
        opacity: 1.0,
      });
    scene.addLayer(layer);

});
it('PolygonLayer extrude', () => {
    const layer = new PolygonLayer({})
    .source(data)
    .size(1000)
    .shape('extrude')
    .active(true)
    .color('red');
    scene.addLayer(layer);

});

it('PolygonLayer ocean', () => {
    const layer = new PolygonLayer({})
    .source(data)
    .size(0.5)
    .shape('ocean')
    .active(true)
    .color('red');
    scene.addLayer(layer);

});
it('PolygonLayer water', () => {
    const layer = new PolygonLayer({})
    .source(data)
    .shape('water')
    .active(true)
    .color('red');
    scene.addLayer(layer);

});
});
