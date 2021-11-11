// @ts-nocheck
// tslint:disable
import { $document } from '../document';
import { Event } from '../Event';
import { getCanvas } from '../register';

class TouchEvent extends Event {
  public touches: any[];
  public targetTouches: any[];
  public changedTouches: any[];

  constructor(type) {
    super(type);

    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];

    this.target = getCanvas();
    this.currentTarget = getCanvas();
  }
}

function mapEvent(event) {
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

function eventHandlerFactory(type) {
  return (rawEvent) => {
    const event = new TouchEvent(type);

    event.changedTouches = rawEvent.changedTouches;
    event.touches = rawEvent.touches;
    event.targetTouches = Array.prototype.slice.call(rawEvent.touches);
    event.timeStamp = rawEvent.timeStamp;

    event.changedTouches.forEach((e) => mapEvent(e));
    event.touches.forEach((e) => mapEvent(e));
    event.targetTouches.forEach((e) => mapEvent(e));

    $document.dispatchEvent(event);
  };
}

function eventMapHandlerFactory(type) {
  return function (rawEvent) {
    rawEvent.type = type;
    $document.dispatchEvent(rawEvent);
  };
}

const dispatchTouchStart = eventHandlerFactory('touchstart');
const dispatchTouchMove = eventHandlerFactory('touchmove');
const dispatchTouchEnd = eventHandlerFactory('touchend');
const dispatchMapCameraParams = eventMapHandlerFactory('mapCameaParams');
export { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd, dispatchMapCameraParams };
