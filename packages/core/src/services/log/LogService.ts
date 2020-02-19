import { injectable } from 'inversify';
import Probe, { Log } from 'probe.gl';
import { ILogService } from './ILogService';
const Logger = new Log({ id: 'L7' }).enable(true);
// // 只输出 debug 级别以上的日志信息
Logger.priority = 2;

@injectable()
export default class LogService implements ILogService {
  public error(message: string): void {
    Logger.error(message)();
  }

  public warn(message: string): void {
    Logger.info(1, message)();
  }

  public info(message: string): void {
    Logger.info(3, message)();
  }

  public debug(message: string): void {
    Logger.probe(4, message)();
  }
}
