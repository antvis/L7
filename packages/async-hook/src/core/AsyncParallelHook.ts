// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import async from 'async/dist/async.js';
import { CallBack } from './IHook';
export default class AsyncParallelHook {
  private tasks: any[];
  constructor(...args: any[]) {
    this.tasks = [];
  }

  public promise(...args: any[]) {
    return new Promise((resolve, reject) => {
      async.parallel(this.tasks).then((res: any, err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    // return async.parallel(this.tasks).then((err, res) => {
    //   return new Promise(r);
    // });
  }
  public tapPromise(name: string, cb: CallBack) {
    this.tasks.push(async (callback: any) => {
      await cb();
      callback(null, name);
    });
  }
}
