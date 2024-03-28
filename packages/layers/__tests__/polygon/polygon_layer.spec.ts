import { TestScene } from '@antv/l7-test-utils';
import PolygonLayer from '../../src/polygon/index';
describe('PolygonLayer', () => {
  let scene: any;
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          base_height: 100,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
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
              [119.948198, 30.339818],
            ],
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    scene = TestScene();
  });

  it('PolygonLayer fill', () => {
    const layer = new PolygonLayer({})
      .source(data)
      .size(0.5)
      .shape('fill')
      .active(true)
      .color('red');
    scene.addLayer(layer);
    layer.on('inited', () => {
      const color = layer.styleAttributeService.getLayerStyleAttribute('color');
      const position = layer.styleAttributeService.getLayerStyleAttribute('position');

      expect(color?.descriptor.buffer.data).toEqual([
        1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0,
        1, 1, 0, 0, 1, 1, 0, 0, 1,
      ]);
      expect(position?.descriptor.buffer.data).toEqual([
        119.948198, 30.339818, 0, 120.344273, 30.513865, 0, 120.414729, 30.288859, 0, 120.346177,
        30.160522, 0, 120.100535, 30.041909, 0, 119.906306, 30.094644, 0, 119.845646, 30.175339, 0,
        119.81137, 30.244454, 0, 119.807562, 30.352965, 0, 119.948198, 30.339818, 0,
      ]);
    });
  });
  it('PolygonLayer extrude', () => {
    const layer = new PolygonLayer({})
      .source(data)
      .size(1000)
      .shape('extrusion')
      .active(true)
      .color('red')
      .style({
        extrusionBase: {
          field: 'base_height',
        },
        opacity: 1.0,
      });
    scene.addLayer(layer);
    layer.on('inited', () => {
      const extrusionBase = layer.styleAttributeService.getLayerStyleAttribute('extrusionBase');
      expect((extrusionBase?.descriptor.buffer.data as Array<number>).every((v) => v === 100)).toBe(
        true,
      );
    });
  });
  it('PolygonLayer extrude', () => {
    const layer = new PolygonLayer({})
      .source(data)
      .size(1000)
      .shape('extrude')
      .active(true)
      .color('red');
    scene.addLayer(layer);
    layer.on('inited', () => {
      const size = layer.styleAttributeService.getLayerStyleAttribute('size');
      expect((size?.descriptor.buffer.data as Array<number>).every((v) => v == 1000)).toBe(true);
    });
  });

  it('PolygonLayer ocean', () => {
    const layer = new PolygonLayer({})
      .source(data)
      .size(0.5)
      .shape('ocean')
      .active(true)
      .color('red');
    scene.addLayer(layer);
    layer.on('inited', () => {
      const oceanUv = layer.styleAttributeService.getLayerStyleAttribute('oceanUv');
      expect(oceanUv?.descriptor.buffer.data).toEqual([
        0.23162655414408723, 0.631221978320016, 0.8839594378482458, 1, 1, 0.5232479298917673,
        0.8870953131510804, 0.2513221571502432, 0.4825245772579771, 0, 0.16263070950825398,
        0.11173711108662368, 0.06272409403014068, 0.28271703294375106, 0.0062717506056691585,
        0.4291607692242522, 0, 0.6590783886633532,
      ]);
    });
  });
  it('PolygonLayer water', () => {
    const layer = new PolygonLayer({}).source(data).shape('water').active(true).color('red');
    scene.addLayer(layer);
  });
  // vector data
  it('PolygonLayer mvt', async () => {
    const layer = new PolygonLayer({
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    });
    layer
      .source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf', {
        parser: {
          type: 'mvt',
          tileSize: 256,
          maxZoom: 9,
          extent: [-180, -85.051129, 179, 85.051129],
        },
      })
      // .shape('line')
      .color('COLOR')
      // .active(true)
      .size(10)
      .select(true)

      .style({
        // opacity: 0.3
      });
    scene.addLayer(layer);
  });
});
