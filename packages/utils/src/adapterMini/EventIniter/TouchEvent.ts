import document from '../aliDocument';
import Event from '../Event';
// import { getCanvas } from '../register';

class TouchEvent extends Event {
  public touches: any[];
  public targetTouches: any[];
  public changedTouches: any[];

  constructor(type: any, eventData?: any) {
    super(type, eventData);

    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];

    // this.target = getCanvas();
    // this.currentTarget = getCanvas();
  }
}

function mapEvent(event: any) {
  const { x = 0, y = 0, clientX = 0, clientY = 0 } = event || {};
  // 小程序不支持Object.hasOwnProperty
  // (抹平不同的view事件)[https://docs.alipay.com/mini/framework/event-object]
  if (Object.keys(event).indexOf('x') !== -1) {
    event.pageX = event.clientX = x;
    event.pageY = event.clientY = y;
  } else {
    event.x = clientX;
    event.y = clientY;
  }
}

function eventHandlerFactory(type: any, eventData?: any) {
  return (rawEvent: any) => {
    const event = new TouchEvent(type, eventData);

    event.changedTouches = rawEvent.changedTouches;
    event.touches = rawEvent.touches;
    event.targetTouches = Array.prototype.slice.call(rawEvent.touches);
    event.timeStamp = rawEvent.timeStamp;

    event.changedTouches.forEach((e) => mapEvent(e));
    event.touches.forEach((e) => mapEvent(e));
    event.targetTouches.forEach((e) => mapEvent(e));
    // @ts-ignore
    document.dispatchEvent(event);
  };
}

const dispatchTouchStart = eventHandlerFactory('touchstart');
const dispatchTouchMove = eventHandlerFactory('touchmove');
const dispatchTouchEnd = eventHandlerFactory('touchend');
export { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd };