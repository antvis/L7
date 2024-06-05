import type { MapOptions } from '../../src/map/map';
import { Map } from '../../src/map/map';
import { DOM } from '../../src/map/util/dom';
import simulate from '../libs/simulate_interaction';
import { beforeMapTest } from '../libs/util';

function createMap() {
  return new Map({ container: DOM.create('div', '', window.document.body) } as any as MapOptions);
}

beforeEach(() => {
  beforeMapTest();
});

describe('touch zoom rotate', () => {
  test('TwoFingersTouchZoomRotateHandler fires zoomstart, zoom, and zoomend events at appropriate times in response to a pinch-zoom gesture', () => {
    const map = createMap();
    const target = map.getCanvasContainer();

    const zoomstart = jest.fn();
    const zoom = jest.fn();
    const zoomend = jest.fn();

    map.handlers._handlersById.tapZoom.disable();
    map.touchPitch.disable();
    map.on('zoomstart', zoomstart);
    map.on('zoom', zoom);
    map.on('zoomend', zoomend);

    simulate.touchstart(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 1, clientX: 0, clientY: -50 },
        { target, identifier: 2, clientX: 0, clientY: 50 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(0);
    expect(zoom).toHaveBeenCalledTimes(0);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 1, clientX: 0, clientY: -100 },
        { target, identifier: 2, clientX: 0, clientY: 100 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(1);
    expect(zoom).toHaveBeenCalledTimes(1);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 1, clientX: 0, clientY: -60 },
        { target, identifier: 2, clientX: 0, clientY: 60 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(1);
    expect(zoom).toHaveBeenCalledTimes(2);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchend(map.getCanvasContainer(), { touches: [] });
    map._renderTaskQueue.run();

    // incremented because inertia starts a second zoom
    expect(zoomstart).toHaveBeenCalledTimes(2);
    map._renderTaskQueue.run();
    expect(zoom).toHaveBeenCalledTimes(3);
    expect(zoomend).toHaveBeenCalledTimes(1);

    map.remove();
  });

  test('TwoFingersTouchZoomRotateHandler fires rotatestart, rotate, and rotateend events at appropriate times in response to a pinch-rotate gesture', () => {
    const map = createMap();
    const target = map.getCanvasContainer();

    const rotatestart = jest.fn();
    const rotate = jest.fn();
    const rotateend = jest.fn();

    map.on('rotatestart', rotatestart);
    map.on('rotate', rotate);
    map.on('rotateend', rotateend);

    simulate.touchstart(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: 0, clientY: -50 },
        { target, identifier: 1, clientX: 0, clientY: 50 },
      ],
    });
    map._renderTaskQueue.run();
    expect(rotatestart).toHaveBeenCalledTimes(0);
    expect(rotate).toHaveBeenCalledTimes(0);
    expect(rotateend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: -50, clientY: 0 },
        { target, identifier: 1, clientX: 50, clientY: 0 },
      ],
    });
    map._renderTaskQueue.run();
    expect(rotatestart).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(rotateend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: 0, clientY: -50 },
        { target, identifier: 1, clientX: 0, clientY: 50 },
      ],
    });
    map._renderTaskQueue.run();
    expect(rotatestart).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(2);
    expect(rotateend).toHaveBeenCalledTimes(0);

    simulate.touchend(map.getCanvasContainer(), { touches: [] });
    map._renderTaskQueue.run();
    expect(rotatestart).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledTimes(2);
    expect(rotateend).toHaveBeenCalledTimes(1);

    map.remove();
  });

  test('TwoFingersTouchZoomRotateHandler does not begin a gesture if preventDefault is called on the touchstart event', () => {
    const map = createMap();
    const target = map.getCanvasContainer();

    map.on('touchstart', (e) => e.preventDefault());

    const move = jest.fn();
    map.on('move', move);

    simulate.touchstart(map.getCanvasContainer(), {
      touches: [
        { target, clientX: 0, clientY: 0 },
        { target, clientX: 5, clientY: 0 },
      ],
    });
    map._renderTaskQueue.run();

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, clientX: 0, clientY: 0 },
        { target, clientX: 0, clientY: 5 },
      ],
    });
    map._renderTaskQueue.run();

    simulate.touchend(map.getCanvasContainer(), { touches: [] });
    map._renderTaskQueue.run();

    expect(move).toHaveBeenCalledTimes(0);

    map.remove();
  });

  test('TwoFingersTouchZoomRotateHandler starts zoom immediately when rotation disabled', () => {
    const map = createMap();
    const target = map.getCanvasContainer();
    map.touchZoomRotate.disableRotation();
    map.handlers._handlersById.tapZoom.disable();

    const zoomstart = jest.fn();
    const zoom = jest.fn();
    const zoomend = jest.fn();

    map.on('zoomstart', zoomstart);
    map.on('zoom', zoom);
    map.on('zoomend', zoomend);

    simulate.touchstart(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: 0, clientY: -5 },
        { target, identifier: 2, clientX: 0, clientY: 5 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(0);
    expect(zoom).toHaveBeenCalledTimes(0);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: 0, clientY: -5 },
        { target, identifier: 2, clientX: 0, clientY: 6 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(1);
    expect(zoom).toHaveBeenCalledTimes(1);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchmove(map.getCanvasContainer(), {
      touches: [
        { target, identifier: 0, clientX: 0, clientY: -5 },
        { target, identifier: 2, clientX: 0, clientY: 4 },
      ],
    });
    map._renderTaskQueue.run();
    expect(zoomstart).toHaveBeenCalledTimes(1);
    expect(zoom).toHaveBeenCalledTimes(2);
    expect(zoomend).toHaveBeenCalledTimes(0);

    simulate.touchend(map.getCanvasContainer(), { touches: [] });
    map._renderTaskQueue.run();
    // incremented because inertia starts a second zoom
    expect(zoomstart).toHaveBeenCalledTimes(2);
    map._renderTaskQueue.run();
    expect(zoom).toHaveBeenCalledTimes(3);
    expect(zoomend).toHaveBeenCalledTimes(1);

    map.remove();
  });

  test('TwoFingersTouchZoomRotateHandler adds css class used for disabling default touch behavior in some browsers', () => {
    const map = createMap();

    const className = 'l7-touch-zoom-rotate';
    expect(map.getCanvasContainer().classList.contains(className)).toBeTruthy();
    map.touchZoomRotate.disable();
    expect(map.getCanvasContainer().classList.contains(className)).toBeFalsy();
    map.touchZoomRotate.enable();
    expect(map.getCanvasContainer().classList.contains(className)).toBeTruthy();
  });
});
