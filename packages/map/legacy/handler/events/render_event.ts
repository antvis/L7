import { Event } from './event';
export default class RenderFrameEvent extends Event {
  public type: string = 'renderFrame';
  public timeStamp: number;

  constructor(type: string, timeStamp: number) {
    super(type);
    this.timeStamp = timeStamp;
  }
}
