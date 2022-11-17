import { PointLayer } from '@antv/l7-layers';
import { TestScene } from '@antv/l7-test-utils';
import LayerPopup from '../src/popup/layerPopup';

describe('popup', () => {
  const scene = TestScene();
  const testClassName = 'l7-layer-popup-test';

  it('life cycle', () => {
    const pointLayer = new PointLayer();
    pointLayer.source([{ lng: 120, lat: 30 }], {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    });
    const layerPopup = new LayerPopup({
      className: testClassName,
      items: [
        {
          layer: pointLayer,
          fields: [
            {
              field: 'lng',
            },
          ],
        },
      ],
    });
    scene.addPopup(layerPopup);

    expect(layerPopup.isOpen()).toEqual(true);

    layerPopup.setOptions({
      trigger: 'click',
    });

    scene.removePopup(layerPopup);

    expect(layerPopup.isOpen()).toEqual(false);
  });
});
