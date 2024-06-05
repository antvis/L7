import type { MapOptions } from '../../src/map/map';
import { Map } from '../../src/map/map';
import { fixedLngLat } from '../libs/fixed';
import { beforeMapTest, createMap } from '../libs/util';

beforeEach(() => {
  beforeMapTest();
  global.fetch = null;
});

describe('Map', () => {
  test('constructor', () => {
    const map = createMap({ interactive: true, style: null });
    expect(map.getContainer()).toBeTruthy();
    expect(map.boxZoom.isEnabled()).toBeTruthy();
    expect(map.doubleClickZoom.isEnabled()).toBeTruthy();
    expect(map.dragPan.isEnabled()).toBeTruthy();
    expect(map.dragRotate.isEnabled()).toBeTruthy();
    expect(map.keyboard.isEnabled()).toBeTruthy();
    expect(map.scrollZoom.isEnabled()).toBeTruthy();
    expect(map.touchZoomRotate.isEnabled()).toBeTruthy();
    expect(() => {
      new Map({
        container: 'anElementIdWhichDoesNotExistInTheDocument',
      } as any as MapOptions);
    }).toThrow(new Error("Container 'anElementIdWhichDoesNotExistInTheDocument' not found."));
  });

  test('bad map-specific token breaks map', () => {
    const container = window.document.createElement('div');
    Object.defineProperty(container, 'offsetWidth', { value: 512 });
    Object.defineProperty(container, 'offsetHeight', { value: 512 });
    createMap();
    //t.error();
  });

  test('#remove', () => {
    const map = createMap();

    expect(map.getContainer().childNodes).toHaveLength(1);
    map.remove();
    expect(map.getContainer().childNodes).toHaveLength(0);
  });

  test('#project', () => {
    const map = createMap();
    expect(map.project([0, 0])).toEqual({ x: 100, y: 100 });
  });

  test('#unproject', () => {
    const map = createMap();
    expect(fixedLngLat(map.unproject([100, 100]))).toEqual({ lng: 0, lat: 0 });
  });

  describe('cooperativeGestures option', () => {
    test('cooperativeGesture container element is hidden from a11y tree', () => {
      const map = createMap({ cooperativeGestures: true });
      expect(
        map
          .getContainer()
          .querySelector('.l7-cooperative-gesture-screen')
          .getAttribute('aria-hidden'),
      ).toBeTruthy();
    });

    test('cooperativeGesture container element is not available when cooperativeGestures not initialized', () => {
      const map = createMap({ cooperativeGestures: false });
      expect(map.getContainer().querySelector('.l7-cooperative-gesture-screen')).toBeFalsy();
    });

    test('cooperativeGesture container element is not available when cooperativeGestures disabled', () => {
      const map = createMap({ cooperativeGestures: true });
      map.cooperativeGestures.disable();
      expect(map.getContainer().querySelector('.l7-cooperative-gesture-screen')).toBeFalsy();
    });
  });
});
