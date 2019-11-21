/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void | false;*/

/*:: export type DraggableData = {
  node: HTMLElement,
  x: number, y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number
};*/

/*:: export type Bounds = {
  left: number, top: number, right: number, bottom: number
};*/

/*:: export type ControlPosition = {x: number, y: number};*/

/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

/*:: export type EventHandler<T> = (e: T) => void | false;*/

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line no-use-before-define
// Missing in Flow
export class SVGElement extends HTMLElement {} // Missing targetTouches

export class TouchEvent2 extends TouchEvent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "changedTouches", void 0);

    _defineProperty(this, "targetTouches", void 0);
  }

}
/*:: export type MouseTouchEvent = MouseEvent & TouchEvent2;*/