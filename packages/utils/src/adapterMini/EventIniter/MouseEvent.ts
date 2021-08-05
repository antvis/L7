import document from '../document';
import Event from '../Event';

class MouseEvent extends Event {
  constructor(type: any) {
    super(type);
  }
}

function eventHandlerFactory(type: any) {
  return (rawEvent: any) => {
    rawEvent.type = type;
    document.dispatchEvent(rawEvent);
  };
}

const dispatchMouseDown = eventHandlerFactory('mousedown');
const dispatchMouseMove = eventHandlerFactory('mousemove');
const dispatchMouseUp = eventHandlerFactory('mouseup');
export { dispatchMouseDown, dispatchMouseMove, dispatchMouseUp };
