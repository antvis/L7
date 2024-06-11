import { ErrorEvent } from '../../src/map/util/evented';
import simulate from '../libs/simulate_interaction';
import { beforeMapTest, createMap } from '../libs/util';

function assertNotAny() {}

beforeEach(() => {
  beforeMapTest();
});

describe('map events', () => {
  test('Map#on adds a non-delegated event listener', () => {
    const map = createMap();
    const spy = jest.fn(function (e) {
      expect(this).toBe(map);
      expect(e.type).toBe('click');
    });

    map.on('click', spy);
    simulate.click(map.getCanvasContainer());

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Map#off removes a non-delegated event listener', () => {
    const map = createMap();
    const spy = jest.fn();

    map.on('click', spy);
    map.off('click', spy);
    simulate.click(map.getCanvasContainer());

    expect(spy).not.toHaveBeenCalled();
  });

  test("Map#on calls an event listener with no type arguments, defaulting to 'unknown' originalEvent type", () => {
    const map = createMap();

    const handler = {
      onMove: function onMove() {},
    };

    jest.spyOn(handler, 'onMove');

    map.on('move', () => handler.onMove());
    map.jumpTo({ center: { lng: 10, lat: 10 } });

    expect(handler.onMove).toHaveBeenCalledTimes(1);
  });

  test('Map#on allows a listener to infer the event type ', () => {
    const map = createMap();

    const spy = jest.fn();
    map.on('mousemove', (event) => {
      assertNotAny();
      const { lng, lat } = event.lngLat;
      spy({ lng, lat });
    });

    simulate.mousemove(map.getCanvasContainer());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("Map#off calls an event listener with no type arguments, defaulting to 'unknown' originalEvent type", () => {
    const map = createMap();

    const handler = {
      onMove: function onMove() {},
    };

    jest.spyOn(handler, 'onMove');

    map.off('move', () => handler.onMove());
    map.jumpTo({ center: { lng: 10, lat: 10 } });

    expect(handler.onMove).toHaveBeenCalledTimes(0);
  });

  test('Map#off allows a listener to infer the event type ', () => {
    const map = createMap();

    const spy = jest.fn();
    map.off('mousemove', (event) => {
      assertNotAny();
      const { lng, lat } = event.lngLat;
      spy({ lng, lat });
    });

    simulate.mousemove(map.getCanvasContainer());
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("Map#once calls an event listener with no type arguments, defaulting to 'unknown' originalEvent type", () => {
    const map = createMap();

    const handler = {
      onMoveOnce: function onMoveOnce() {},
    };

    jest.spyOn(handler, 'onMoveOnce');

    map.once('move', () => handler.onMoveOnce());
    map.jumpTo({ center: { lng: 10, lat: 10 } });

    expect(handler.onMoveOnce).toHaveBeenCalledTimes(1);
  });

  test('Map#once allows a listener to infer the event type ', () => {
    const map = createMap();

    const spy = jest.fn();
    map.once('mousemove', (event) => {
      assertNotAny();
      const { lng, lat } = event.lngLat;
      spy({ lng, lat });
    });

    simulate.mousemove(map.getCanvasContainer());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Map#on mousedown can have default behavior prevented and still fire subsequent click event', () => {
    const map = createMap();

    map.on('mousedown', (e) => e.preventDefault());

    const click = jest.fn();
    map.on('click', click);

    simulate.click(map.getCanvasContainer());
    expect(click).toHaveBeenCalled();

    map.remove();
  });

  test("Map#on mousedown doesn't fire subsequent click event if mousepos changes", () => {
    const map = createMap();

    map.on('mousedown', (e) => e.preventDefault());

    const click = jest.fn();
    map.on('click', click);
    const canvas = map.getCanvasContainer();

    simulate.drag(canvas, {}, { clientX: 100, clientY: 100 });
    expect(click).not.toHaveBeenCalled();

    map.remove();
  });

  test('Map#on mousedown fires subsequent click event if mouse position changes less than click tolerance', () => {
    const map = createMap({ clickTolerance: 4 });

    map.on('mousedown', (e) => e.preventDefault());

    const click = jest.fn();
    map.on('click', click);
    const canvas = map.getCanvasContainer();

    simulate.drag(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 103 });
    expect(click).toHaveBeenCalled();

    map.remove();
  });

  test('Map#on mousedown does not fire subsequent click event if mouse position changes more than click tolerance', () => {
    const map = createMap({ clickTolerance: 4 });

    map.on('mousedown', (e) => e.preventDefault());

    const click = jest.fn();
    map.on('click', click);
    const canvas = map.getCanvasContainer();

    simulate.drag(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 104 });
    expect(click).not.toHaveBeenCalled();

    map.remove();
  });

  test('Map#on click fires subsequent click event if there is no corresponding mousedown/mouseup event', () => {
    const map = createMap({ clickTolerance: 4 });

    const click = jest.fn();
    map.on('click', click);
    const canvas = map.getCanvasContainer();

    const event = new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 });
    canvas.dispatchEvent(event);
    expect(click).toHaveBeenCalled();

    map.remove();
  });

  test('Map#isMoving() returns false in mousedown/mouseup/click with no movement', () => {
    const map = createMap({ interactive: true, clickTolerance: 4 });
    let mousedown, mouseup, click;
    map.on('mousedown', () => {
      mousedown = map.isMoving();
    });
    map.on('mouseup', () => {
      mouseup = map.isMoving();
    });
    map.on('click', () => {
      click = map.isMoving();
    });

    const canvas = map.getCanvasContainer();

    canvas.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    expect(mousedown).toBe(false);
    map._renderTaskQueue.run();
    expect(mousedown).toBe(false);

    canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 100, clientY: 100 }));
    expect(mouseup).toBe(false);
    map._renderTaskQueue.run();
    expect(mouseup).toBe(false);

    canvas.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 }));
    expect(click).toBe(false);
    map._renderTaskQueue.run();
    expect(click).toBe(false);

    map.remove();
  });

  describe('error event', () => {
    test('logs errors to console when it has NO listeners', () => {
      // to avoid seeing error in the console in Jest
      let stub = jest.spyOn(console, 'error').mockImplementation(() => {});
      const map = createMap();
      stub.mockReset();
      stub = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('test');
      map.fire(new ErrorEvent(error));
      expect(stub).toHaveBeenCalledTimes(1);
      expect(stub.mock.calls[0][0]).toBe(error);
    });

    test('calls listeners', (done) => {
      const map = createMap();
      const error = new Error('test');
      map.on('error', (event) => {
        expect(event.error).toBe(error);
        done();
      });
      map.fire(new ErrorEvent(error));
    });
  });
});
