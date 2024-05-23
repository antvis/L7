import { RasterLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const tileUpdate: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 2,
    },
  });

  const url1 =
    'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
  const url2 =
    'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

  const layer1 = new RasterLayer({
    zIndex: 1,
  }).source(url1, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
    },
  });

  scene.addLayer(layer1);

  tileUpdate.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setData: () => {
            layer1.setData(url2);
            console.log('update');
          },
        },
        'setData',
      ),
    ];
  };

  return scene;
};
