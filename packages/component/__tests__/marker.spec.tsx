import { TestScene } from '@antv/l7-test-utils';
import Marker from '../src/marker';
import Popup from '../src/popup/popup';

describe('Marker', () => {
  let scene: ReturnType<typeof TestScene>;
  let marker: Marker;
  let popup: Popup;

  beforeEach(() => {
    popup = new Popup({ offsets: [0, 20] }).setHTML('<h1>test</h1>');
    marker = new Marker().setLnglat({ lng: 120, lat: 30 }).setPopup(popup);
    scene = TestScene({
      center: [120, 30],
      zoom: 5,
      interactive: false,
    });
    scene.addMarker(marker);
  });

  afterEach(() => {
    marker.remove();
    scene.destroy();
  });

  it('render and remove correctly', () => {
    expect(document.querySelector('.l7-marker')).toBeTruthy();
    expect(marker.getDefault().draggable).toEqual(false);
    expect(marker.getDefault().color).toEqual('#5B8FF9');
    expect(marker.getOffset()).toEqual([0, 0]);
    expect(marker.getDraggable()).toEqual(false);
  });

  it('open popup and close popup correctly', () => {
    marker.openPopup();
    expect(marker.getPopup()?.isOpen()).toBeTruthy();

    marker.getPopup()?.close();
    expect(marker.getPopup()?.isOpen()).toBeFalsy();

    marker.togglePopup();
    expect(marker.getPopup()?.isOpen()).toBeTruthy();

    marker.closePopup();
    expect(marker.getPopup()?.isOpen()).toBeFalsy();
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
    el.innerHTML = '<h1>test element</h1>';
    marker.setElement(el);
    expect(marker.getElement()).toBeTruthy();
    expect(marker.getElement().id).toEqual('markerDom');
  });

  it('extData', () => {
    marker.setExtData({ test: 1 });
    expect(marker.getExtData()).toEqual({ test: 1 });
  });

  it('show and hide', () => {
    marker.hide();
    expect(marker.getElement().style.display).toEqual('none');

    marker.show();
    expect(marker.getElement().style.display).not.toEqual('none');
  });

  it('draggable', () => {
    marker.setDraggable(true);
    expect(marker.getDraggable()).toBeTruthy();

    marker.setDraggable(false);
    expect(marker.getDraggable()).toBeFalsy();
  });
});
