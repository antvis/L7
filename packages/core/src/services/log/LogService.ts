import { injectable } from 'inversify';
import Probe, { Log } from 'probe.gl';
import { ILogService } from './ILogService';
// !process.env.NODE_ENV === 'production',
// const Logger = new Log({ id: 'L7' }).enable( // l7 -mini
//   // @ts-ignore// l7 -mini
//   process.env.NODE_ENV !== 'production',// l7 -mini
// );// l7 -mini
// // // 只输出 debug 级别以上的日志信息
// Logger.priority = 5;// l7 -mini

@injectable()
export default class LogService implements ILogService {
  public error(message: string): void {
    // Logger.error(message)();// l7 -mini
  }

  public warn(message: string): void {
    // Logger.probe(1, message)();// l7 -mini
  }

  public info(message: string): void {
    // Logger.info(3, message)();// l7 -mini
  }

  public debug(message: string): void {
    // Logger.probe(4, message)();// l7 -mini
  }
}
