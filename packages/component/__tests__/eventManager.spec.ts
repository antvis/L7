import { EventManager } from '../src/utils/eventManager';

describe('EventManager', () => {
  let eventManager: EventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  afterEach(() => {
    eventManager.clear();
  });

  it('should bind and unbind DOM events correctly', () => {
    const button = document.createElement('button');
    const handler = jest.fn();

    eventManager.on(button, 'click', handler);
    expect(eventManager.size()).toBe(1);

    button.click();
    expect(handler).toHaveBeenCalledTimes(1);

    eventManager.off(button, 'click', handler);
    expect(eventManager.size()).toBe(0);

    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should clear all events', () => {
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    eventManager.on(button1, 'click', handler1);
    eventManager.on(button2, 'click', handler2);
    expect(eventManager.size()).toBe(2);

    eventManager.clear();
    expect(eventManager.size()).toBe(0);

    button1.click();
    button2.click();
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should handle window events', () => {
    const handler = jest.fn();

    eventManager.on(window, 'resize', handler);
    expect(eventManager.size()).toBe(1);

    window.dispatchEvent(new Event('resize'));
    expect(handler).toHaveBeenCalledTimes(1);

    eventManager.clear();
    expect(eventManager.size()).toBe(0);
  });

  it('should handle document events', () => {
    const handler = jest.fn();

    eventManager.on(document, 'keydown', handler);
    expect(eventManager.size()).toBe(1);

    document.dispatchEvent(new KeyboardEvent('keydown'));
    expect(handler).toHaveBeenCalledTimes(1);

    eventManager.clear();
  });

  it('should support method chaining', () => {
    const button = document.createElement('button');
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const result = eventManager.on(button, 'click', handler1).on(button, 'mouseover', handler2);

    expect(result).toBe(eventManager);
    expect(eventManager.size()).toBe(2);
  });
});
