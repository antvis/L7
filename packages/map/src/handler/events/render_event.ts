import { Event } from './event';
export default class RenderFrameEvent extends Event {
  public type: string = 'renderFrame';
  public timeStamp: number;
}
