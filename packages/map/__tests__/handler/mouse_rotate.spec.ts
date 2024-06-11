import { Map } from '../../src/map/map';
import { browser } from '../../src/map/util/browser';
import { DOM } from '../../src/map/util/dom';
import { extend } from '../../src/map/util/util';
import simulate from '../libs/simulate_interaction';
import { beforeMapTest } from '../libs/util';

function createMap(options?) {
  return new Map(extend({ container: DOM.create('div', '', window.document.body) }, options));
}

beforeEach(() => {
  beforeMapTest();
});

describe('mouse rotate', () => {
  test('MouseRotateHandler#isActive', () => {
    const map = createMap({ interactive: true });
    const mouseRotate = map.handlers._handlersById.mouseRotate;

    // Prevent inertial rotation.
    jest.spyOn(browser, 'now').mockReturnValue(0);
    expect(mouseRotate.isActive()).toBe(false);

    simulate.mousedown(map.getCanvasContainer(), { buttons: 2, button: 2, clientX: 0, clientY: 0 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(false);

    simulate.mousemove(map.getCanvasContainer(), { buttons: 2, clientX: 10, clientY: 10 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(true);

    simulate.mouseup(map.getCanvasContainer(), { buttons: 0, button: 2 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(false);

    map.remove();
  });

  test('MouseRotateHandler#isActive #4622 regression test', () => {
    const map = createMap({ interactive: true });
    const mouseRotate = map.handlers._handlersById.mouseRotate;

    // Prevent inertial rotation.
    simulate.mousedown(map.getCanvasContainer(), { buttons: 2, button: 2 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(false);

    simulate.mousemove(map.getCanvasContainer(), { buttons: 2, clientX: 10, clientY: 10 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(true);

    // Some browsers don't fire mouseup when it happens outside the window.
    // Make the handler in active when it encounters a mousemove without the button pressed.

    simulate.mousemove(map.getCanvasContainer(), { buttons: 0, clientX: 10, clientY: 10 });
    map._renderTaskQueue.run();
    expect(mouseRotate.isActive()).toBe(false);

    map.remove();
  });
});
