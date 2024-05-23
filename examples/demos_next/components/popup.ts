import { Popup } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const popup: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.435159, 31.256971],
      zoom: 14.89,
      minZoom: 10,
    },
  });

  const popupIns = new Popup({
    lngLat: {
      lng: 121.435159,
      lat: 31.256971,
    },
    html: '<div>123456</div>',
    className: String(Math.random()),
    style: `z-index: ${String(Math.random())}`,
  });

  scene.addPopup(popupIns);

  popup.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setOptions: () => {
            popupIns.setOptions({
              className: String(Math.random()),
              html: '<div>789</div>',
              style: `z-index: ${String(Math.floor(Math.random() * 100))}`,
            });
          },
        },
        'setOptions',
      ),
    ];
  };

  return scene;
};
