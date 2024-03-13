import { CanvasLayer, PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import * as turf from '@turf/turf';

const POSITION = [120.104697, 30.260704] as [number, number];

export function MapRender(option: { map: string; renderer: string }) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer,
    map: new allMap[option.map || 'Map']({
      // map: new allMap['GoogleMap']({
      style: 'light',
      center: POSITION,
      zoom: 14.89,
      minZoom: 10,
    }),
  });
  scene.on('loaded', () => {
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

    const pointLayer = new PointLayer({});
    pointLayer
      .source(turf.featureCollection([turf.point(POSITION)]))
      .color('red')
      .shape('circle')
      .size(30);
    scene.addLayer(pointLayer);

    const showBtn = document.createElement('button');
    showBtn.innerHTML = 'Show CanvasLayer';
    showBtn.style = 'position: absolute; left: 20px; z-index: 10; top: 60px;';
    showBtn.onclick = () => {
      canvasLayer.show();
    };

    const hideBtn = document.createElement('button');
    hideBtn.innerHTML = 'Hide CanvasLayer';
    hideBtn.style = 'position: absolute; left: 20px; z-index: 10; top: 90px;';
    hideBtn.onclick = () => {
      canvasLayer.hide();
    };

    document.body.append(showBtn, hideBtn);
  });
}
