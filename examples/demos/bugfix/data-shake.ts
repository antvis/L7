import { PointLayer } from '@antv/l7';
import { featureEach, interpolate, randomPoint } from '@turf/turf';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const points = randomPoint(30, { bbox: [120.103217, 30.26128, 120.10348, 30.261506] });

featureEach(points, function (point) {
  // add a random property to each point
  point.properties.solRad = Math.random() * 50;
});

const GEO_DATA = interpolate(points, 0.001, {
  gridType: 'point',
  property: 'solRad',
  units: 'miles',
});

export const dataShake: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.10321541789858, 30.261273569440405],
      zoom: 21.588541277244076,
      maxZoom: 23,
    },
  });

  const layer = new PointLayer({ autoFit: false })
    .source(GEO_DATA)
    .size(15)
    .color('rgb(255, 0, 0)')
    .shape('circle')
    .style({
      stroke: '#0083FE',
      strokeWidth: 2,
      // unit: 'meter',
    });

  scene.addLayer(layer);
  // scene.setZoomAndCenter(22, [120.10348, 30.261506]);

  const mapType = scene.getType();

  if (['default', 'mapbox'].includes(mapType)) {
    const isMapbox = mapType === 'mapbox';

    dataShake.extendGUI = (gui) => {
      return [
        gui.add(
          {
            dispatchWheelEvt: () => {
              const dom = document.querySelector(
                isMapbox ? '.l7-marker-container' : '.l7-canvas-container',
              );
              // console.log('dom: ', dom);
              const wheelEvt = new WheelEvent('wheel', {
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX: 1329,
                clientY: 168,
                deltaY: 200,
              });
              // console.log('wheelEvt: ', wheelEvt);
              dom?.dispatchEvent(wheelEvt);

              const wheelEvt2 = new WheelEvent('wheel', {
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX: 1329,
                clientY: 168,
                deltaY: 400,
              });
              dom?.dispatchEvent(wheelEvt2);
            },
          },
          'dispatchWheelEvt',
        ),
      ];
    };
  }

  return scene;
};
