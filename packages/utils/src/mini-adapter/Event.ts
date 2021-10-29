// @ts-nocheck
// tslint:disable
export class Event {
  public cancelBubble: boolean;
  public cancelable: boolean;
  public target: any;
  public currentTarget: any;
  public preventDefault: any;
  public stopPropagation: any;
  public type: any;
  public timeStamp: number;

  constructor(type: any,data) {
    this.cancelBubble = false;
    this.cancelable = false;
    this.target = null;
    this.currentTarget = null;
    this.preventDefault = () => {
      // TODO
    };
    this.stopPropagation = () => {
      // TODO
    };

    this.type = type;
    this.timeStamp = Date.now();
  }
}
