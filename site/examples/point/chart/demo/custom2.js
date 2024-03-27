import { CanvasLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'fresh',
    center: [90, 31],
    zoom: 2,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new CanvasLayer({}).style({
        zIndex: 10,
        update: 'dragend',
        drawingOnCanvas: (option) => {
          const { size, ctx, mapService } = option;
          const [width, height] = size;

          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
          data.features.map((feature) => {
            const pixelCenter = mapService.lngLatToContainer(feature.geometry.coordinates);
            pixelCenter.x *= window.devicePixelRatio;
            pixelCenter.y *= window.devicePixelRatio;
            if (
              pixelCenter.x < 0 ||
              pixelCenter.y < 0 ||
              pixelCenter.x > width ||
              pixelCenter.y > height
            ) {
              return '';
            }
            ctx.beginPath();
            ctx.arc(
              pixelCenter.x,
              pixelCenter.y,
              feature.properties.capacity / 200,
              0,
              Math.PI * 2,
            );
            ctx.fill();
            ctx.closePath();
            return '';
          });
          return '';
        },
      });

      scene.addLayer(layer);
      return '';
    });
  return '';
});
