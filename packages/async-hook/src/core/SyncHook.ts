// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import async from 'async/dist/async.js';
import { CallBack, IHook } from './IHook';
export default class SyncHook implements IHook {
  private tasks: any[];
  private args: any[];
  constructor(...args: any[]) {
    this.tasks = [];
  }

  public call(...args: any[]): void {
    this.args = args;
    return async.series(this.tasks);
  }
  public tap(name: string, cb: CallBack) {
    this.tasks.push((callback: any) => {
      cb(...this.args);
      callback(null, name);
    });
  }
}
