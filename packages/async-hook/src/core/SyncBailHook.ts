// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import series from 'async/series';
import { CallBack, IHook } from './IHook';
export default class SyncBailHook implements IHook {
  private tasks: any[];
  constructor(...args: any[]) {
    this.tasks = [];
  }

  public call(...args: any[]) {
    return series(this.tasks);
  }
  public tap(name: string, cb: CallBack) {
    this.tasks.push((callback: any) => {
      const err = cb();
      callback(err, name);
    });
  }
}
