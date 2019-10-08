import { injectable } from 'inversify';
import { Log } from 'probe.gl';
import { ILogService } from './ILogService';

const Logger = new Log({ id: 'L7' }).enable();

@injectable()
export default class LogService implements ILogService {
  public error(message: string): void {
    Logger.error(message)();
  }

  public warn(message: string): void {
    Logger.warn(message)();
  }

  public info(message: string): void {
    Logger.info(message)();
  }
}
