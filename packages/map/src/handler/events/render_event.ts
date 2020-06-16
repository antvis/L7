import { Event } from './event';
export default class RenderFrameEvent extends Event {
  public type: 'renderFrame';
  public timeStamp: number;
}
