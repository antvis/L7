import { Scene, GeometryLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.1025, 30.2594 ],
    style: 'dark',
    pitch: 65,
    rotation: 180,
    zoom: 14
  })
});

scene.on('loaded', () => {
  const layer = new GeometryLayer()
    .shape('plane')
    .style({
      width: 0.074,
      height: 0.061,
      center: [ 120.1025, 30.2594 ],
      widthSegments: 200,
      heightSegments: 200,
      terrainClipHeight: 1,
      mapTexture:
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
      terrainTexture:
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
      rgb2height: (r, g, b) => {
        let h =
        -10000.0 +
        (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
        h = h / 20 - 127600;
        h = Math.max(0, h);
        return h;
      }
    });
  scene.addLayer(layer);
});
