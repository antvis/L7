// @ts-nocheck
// tslint:disable
import { $document } from '../document';
import { Event } from '../Event';
import { getCanvas } from '../register';

class PointerEvent extends Event {
  public buttons: number;
  public which: number;

  public pointerId: number;
  public bubbles: boolean;
  public button: number;
  public width: number;
  public height: number;
  public pressure: number;
  public isPrimary: boolean;
  public pointerType: string;
  public altKey: boolean;
  public ctrlKey: boolean;
  public metaKey: boolean;
  public shiftKey: boolean;

  constructor(type) {
    super(type);

    this.target = getCanvas();
    this.currentTarget = getCanvas();
  }
}

const CLONE_PROPS = [
  // MouseEvent
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',

  // PointerEvent
  'pointerId',
  'width',
  'height',
  'pressure',
  'tiltX',
  'tiltY',
  'pointerType',
  'hwTimestamp',
  'isPrimary',

  // event instance
  'pageX',
  'pageY',
  'timeStamp',
];

const CLONE_DEFAULTS = [
  // MouseEvent
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,

  // DOM Level 3
  0,

  // PointerEvent
  0,
  0,
  0,
  0,
  0,
  0,
  '',
  0,
  false,

  // event instance
  0,
  0,
  0,
];

const POINTER_TYPE = 'touch';

function touchToPointer(type, touch, rawEvent) {
  const e = new PointerEvent(type);

  for (let i = 0; i < CLONE_PROPS.length; i++) {
    const p = CLONE_PROPS[i];
    e[p] = touch[p] || CLONE_DEFAULTS[i];
  }

  e.type = type;
  e.target = getCanvas();
  e.currentTarget = getCanvas();
  e.buttons = typeToButtons(type);
  e.which = e.buttons;

  e.pointerId = (touch.identifier || 0) + 2;
  e.bubbles = true;
  e.cancelable = true;
  // e.detail = this.clickCount;
  e.button = 0;

  e.width = (touch.radiusX || 0.5) * 2;
  e.height = (touch.radiusY || 0.5) * 2;
  e.pressure = touch.force || 0.5;
  e.isPrimary = isPrimaryPointer(touch);
  e.pointerType = POINTER_TYPE;

  // forward modifier keys
  e.altKey = rawEvent.altKey;
  e.ctrlKey = rawEvent.ctrlKey;
  e.metaKey = rawEvent.metaKey;
  e.shiftKey = rawEvent.shiftKey;

  if (rawEvent.preventDefault) {
    e.preventDefault = () => {
      rawEvent.preventDefault();
    };
  }

  return e;
}

function typeToButtons(type) {
  let ret = 0;
  if (
    type === 'touchstart' ||
    type === 'touchmove' ||
    type === 'pointerdown' ||
    type === 'pointermove'
  ) {
    ret = 1;
  }
  return ret;
}

let firstPointer = null;

function isPrimaryPointer(touch) {
  return firstPointer === touch.identifier;
}

function setPrimaryPointer(touch) {
  if (firstPointer === null) {
    firstPointer = touch.identifier;
  }
}

function removePrimaryPointer(touch) {
  if (firstPointer === touch.identifier) {
    firstPointer = null;
  }
}

function eventHandlerFactory(type) {
  return (rawEvent) => {
    const changedTouches = rawEvent.changedTouches;

    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];

      if (i === 0 && type === 'pointerdown') {
        setPrimaryPointer(touch);
      } else if (type === 'pointerup' || type === 'pointercancel') {
        removePrimaryPointer(touch);
      }

      const event = touchToPointer(type, touch, rawEvent);
      $document.dispatchEvent(event);
    }
  };
}

const dispatchPointerDown = eventHandlerFactory('pointerdown');
const dispatchPointerMove = eventHandlerFactory('pointermove');
const dispatchPointerUp = eventHandlerFactory('pointerup');
export { dispatchPointerDown, dispatchPointerMove, dispatchPointerUp };
