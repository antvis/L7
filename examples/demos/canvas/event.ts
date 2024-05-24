import { CanvasLayer, PointLayer } from '@antv/l7';
import * as turf from '@turf/turf';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const event: TestCase = async (options) => {
  const POSITION = [120.104697, 30.260704] as [number, number];

  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: POSITION,
      zoom: 14.89,
      minZoom: 10,
    },
  });

  const canvasLayer = new CanvasLayer({
    zIndex: 4,
    draw: ({ canvas, ctx, container, utils }) => {
      const context = ctx as CanvasRenderingContext2D;
      context.clearRect(0, 0, container.width, container.height);
      context.fillStyle = 'blue';
      const { x, y } = utils.lngLatToContainer(POSITION);
      const size = 36 * window.devicePixelRatio;
      context.fillRect(x - size / 2, y - size / 2, size, size);
    },
  });

  scene.addLayer(canvasLayer);

  canvasLayer.on('add', () => {
    canvasLayer.layerModel.canvas?.addEventListener('click', (e) => {
      console.log('canvas click', e);
    });
  });

  const pointLayer = new PointLayer({});
  pointLayer
    .source(turf.featureCollection([turf.point(POSITION)]))
    .color('red')
    .shape('circle')
    .size(30);
  scene.addLayer(pointLayer);

  pointLayer.on('click', (e) => {
    console.log('layer click', e);
  });

  return scene;
};
