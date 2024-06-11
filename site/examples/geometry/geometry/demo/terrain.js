import { GeometryLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.1025, 30.2594],
    style: 'dark',
    pitch: 65,
    rotation: 180,
    zoom: 14,
  }),
});
let currentZoom = 14,
  currentModelData = '100x100';

scene.on('loaded', () => {
  const layer = new GeometryLayer().shape('plane').style({
    width: 0.074,
    height: 0.061,
    center: [120.1025, 30.2594],
    widthSegments: 100,
    heightSegments: 100,
    terrainClipHeight: 1,
    mapTexture:
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
    terrainTexture:
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
    rgb2height: (r, g, b) => {
      let h = (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
      h = h / 200 - 12750;
      h = Math.max(0, h);
      return h;
    },
  });
  scene.addLayer(layer);

  let modelData10,
    modelData20 = null,
    modelData100;

  layer.on('terrainImageLoaded', () => {
    modelData10 = layer.layerModel.createModelData({
      widthSegments: 10,
      heightSegments: 10,
    });

    modelData20 = layer.layerModel.createModelData({
      widthSegments: 20,
      heightSegments: 20,
    });

    modelData100 = layer.layerModel.createModelData({
      widthSegments: 100,
      heightSegments: 100,
    });
  });

  scene.on('zoom', () => {
    const zoom = Math.floor(scene.getZoom());
    if (currentZoom !== zoom) {
      if (zoom > 13) {
        if (currentModelData !== '100x100') {
          layer.updateModelData(modelData100);
          currentModelData = '100x100';
        }
      } else if (zoom > 12) {
        if (currentModelData !== '20x20') {
          layer.updateModelData(modelData20);
          currentModelData = '20x20';
        }
      } else {
        if (currentModelData !== '10x10') {
          layer.updateModelData(modelData10);
          currentModelData = '10x10';
        }
      }
      currentZoom = zoom;
    }
  });
});
