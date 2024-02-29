import { TestScene } from '@antv/l7-test-utils';
import Popup from '../src/popup/popup';

describe('popup', () => {
  const scene = TestScene();
  const className = 'text-class-popup';

  it('life cycle', () => {
    const popup = new Popup({
      html: '123456',
      className,
      lngLat: {
        lng: 120,
        lat: 30,
      },
    });

    popup.setOptions({
      lngLat: { lng: 130, lat: 40 },
    });

    scene.addPopup(popup);

    const targetPopup = document.querySelector(`.${className}`) as HTMLElement;

    expect(targetPopup).not.toBeFalsy();
    expect(popup.getLnglat()).toEqual({
      lng: 130,
      lat: 40,
    });
    expect(/123456/.test(targetPopup.innerHTML)).toEqual(true);

    expect(targetPopup.classList.contains('l7-popup-hide')).toEqual(false);

    popup.hide();

    expect(targetPopup.classList.contains('l7-popup-hide')).toEqual(true);

    popup.show();

    expect(targetPopup.classList.contains('l7-popup-hide')).toEqual(false);

    scene.setZoom(10);
  });
});
