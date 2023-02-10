import { EventEmitter } from 'eventemitter3';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { IDebugService, ILog } from './IDebugService';
import { IRendererService } from '../renderer/IRendererService';

@injectable()
export default class DebugService extends EventEmitter implements IDebugService {

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  private logMap = new Map<string, ILog>();


  log(key: string, values: ILog) {
    const [k1, k2] = key.split('.');
    const logType = k2;
    /**
     * map: {
     *  mapInitStart: { time, ... }
     * },
     * 12: {
     *  layerInitStart: { time, id, ... },
     *  layerInitEnd: { time, id, ... },
     * }
     */
    const cacheLog = this.logMap.get(k1) || {}; // 一级存储对象
    const cacheLogValues = cacheLog[logType] || {}; // 二级存储对象
    const logValues = {
      time: Date.now(),
      ...cacheLogValues,
      ...values,
    }
    this.logMap.set(k1, {
      ...cacheLog,
      [logType]: logValues,
    })
  }

  getLog(key: string | string[] | undefined) {
    switch(typeof key) {
      case 'string':
        return this.logMap.get(key);
      case 'object':
        return (key as Array<string>).map(k => this.logMap.get(k)).filter(o => o !== undefined) as ILog[];
      case 'undefined':
        return Array.from(this.logMap.keys()).map(k => this.logMap.get(k))
    }
  }

  /**
   * 删除日志
   * @param key 
   */
  public removeLog(key: string) {
    this.logMap.delete(key);
  }

  public registerContextLost() {
    const canvas = this.rendererService.getCanvas();
    if(canvas) {
      canvas.addEventListener('webglcontextlost', () => this.emit('webglcontextlost'));
    }
  }

  public lostContext() {
    let gl = this.rendererService.getGLContext();
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if(loseContext) {
      loseContext.loseContext();
      // @ts-ignore
      gl = null;
    }
  }

  public destroy() {
    this.logMap.clear();
  }
}
