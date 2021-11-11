// @ts-nocheck
// tslint:disable
import { $document } from '../document';
import { Event } from '../Event';

class MouseEvent extends Event {
  constructor(type) {
    super(type);
  }
}

function eventHandlerFactory(type) {
  return (rawEvent) => {
    rawEvent.type = type;
    $document.dispatchEvent(rawEvent);
  };
}

const dispatchMouseDown = eventHandlerFactory('mousedown');
const dispatchMouseMove = eventHandlerFactory('mousemove');
const dispatchMouseUp = eventHandlerFactory('mouseup');
export { dispatchMouseDown, dispatchMouseMove, dispatchMouseUp };
