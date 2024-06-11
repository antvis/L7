import { Map } from '../../src/map/map';
import { extend } from '../../src/map/util/util';

export function createMap(options?, callback?) {
  const container = window.document.createElement('div');
  const defaultOptions = {
    container,
    interactive: false,
    attributionControl: false,
    trackResize: true,
  };

  Object.defineProperty(container, 'clientWidth', { value: 200, configurable: true });
  Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true });

  const map = new Map(extend(defaultOptions, options));
  if (callback)
    map.on('load', () => {
      callback(null, map);
    });

  return map;
}

export function setPerformance() {
  window.performance.mark = jest.fn();
  window.performance.clearMeasures = jest.fn();
  window.performance.clearMarks = jest.fn();
}

export function setMatchMedia() {
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

function setResizeObserver() {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

export function beforeMapTest() {
  setPerformance();
  setMatchMedia();
  setResizeObserver();
}

/**
 * This allows test to wait for a certain amount of time before continuing.
 * @param milliseconds - the amount of time to wait in milliseconds
 * @returns - a promise that resolves after the specified amount of time
 */
export const sleep = (milliseconds: number = 0) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
