import { TestScene } from '@antv/l7-test-utils';
import Marker from '../src/marker';
import Popup from '../src/popup/popup';

const popup = new Popup({ offsets: [0, 20] }).setHTML(
  '<h1 onclick= alert("123")>111</h1>',
);

const marker = new Marker().setLnglat({ lng: 120, lat: 30 }).setPopup(popup);

TestScene().addMarker(marker);

describe('Marker', () => {
  it('render and remove correctly', () => {
    expect(document.querySelector('.l7-marker')).toBeTruthy();
    expect(marker.getDefault().draggable).toEqual(false);
    expect(marker.getDefault().color).toEqual('#5B8FF9');
    expect(marker.getOffset()).toEqual([0, 0]);
    expect(marker.isDraggable()).toEqual(false);
    marker.remove();
    expect(document.querySelector('.l7-marker')).toBeFalsy();
  });

  it('open popup and close popup correctly', () => {
    marker.openPopup();
    expect(marker.getPopup().isOpen()).toBeTruthy();

    marker.getPopup().close();
    expect(marker.getPopup().isOpen()).toBeFalsy();

    marker.togglePopup();
    expect(marker.getPopup().isOpen()).toBeTruthy();

    marker.closePopup();
    expect(marker.getPopup().isOpen()).toBeFalsy();
  });

  it('longitude and latitude', () => {
    const { lng, lat } = marker.getLnglat();
    expect(lng).toEqual(120);
    expect(lat).toEqual(30);
    marker.setLnglat({ lng: 121, lat: 31 });
    const { lng: newLng, lat: newLat } = marker.getLnglat();
    expect(newLng).toEqual(121);
    expect(newLat).toEqual(31);
  });

  it('element', () => {
    const el = document.createElement('div');
    el.id = 'markerDom';
    el.innerHTML = '<h1>111</h1>';
    marker.setElement(el);
    expect(marker.getElement()).toBeTruthy();
  });

  it('extData', () => {
    marker.setExtData({ test: 1 });
    expect(marker.getExtData()).toEqual({ test: 1 });
  });
});
