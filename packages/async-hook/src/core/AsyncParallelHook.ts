// @ts-ignore
import { parallel } from 'async-es';
import { CallBack } from './IHook';
export default class AsyncParallelHook {
  private tasks: any[];
  constructor(...args: any[]) {
    this.tasks = [];
  }

  public promise(...args: any[]) {
    return parallel(this.tasks);
  }
  public tapPromise(name: string, cb: CallBack) {
    this.tasks.push(async (callback: any) => {
      await cb();
      callback(null, name);
    });
  }
}
