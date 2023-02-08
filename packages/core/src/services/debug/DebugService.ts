import { EventEmitter } from 'eventemitter3';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { IDebugService, ILayerId, ILayerLog, IMapLog } from './IDebugService';
import { IRendererService } from '../renderer/IRendererService';

@injectable()
export default class DebugService extends EventEmitter implements IDebugService {

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  /** */
  private mapLogCache: IMapLog = {};

  /** 存储 layer 的日志信息 */
  private layerLogMap = new Map<ILayerId, ILayerLog>();

  /**
   * 设置地图日志信息
   * @param logs 
   */
  public mapLog(logs: IMapLog) {
    this.mapLogCache = {
      ...this.mapLogCache,
      ...logs,
    }
  }

  /**
   * 获取地图日志信息
   * @returns 
   */
  public getMapLog() {
    return this.mapLogCache;
  }

  /**
   * 设置、更新 layer 的日志
   * @param id 
   * @param layerLogs 
   */
  public layerLog(id: ILayerId, logs: ILayerLog) {
    const lastLog = this.layerLogMap.get(id) || {};
    this.layerLogMap.set(id, {
      ...lastLog,
      ...logs,
    });
  }

  /**
   * 删除对应 layer 的日志
   * @param id 
   */
  public removeLayerLog(id: ILayerId) {
    this.layerLogMap.delete(id);
  }

  /**
   * 获取对应的图层日志
   * @param flag 
   * @returns 
   */
  public getLayerLog(flag: undefined | ILayerId | ILayerId[]) {
    switch(typeof flag) {
      case 'undefined': // 获取所有图层的日志
        return [...this.layerLogMap.values()];
      case 'string':    // 获取对应图层的日志
        return this.layerLogMap.has(flag) ? this.layerLogMap.get(flag) as ILayerLog : undefined;
      case 'object':    // 获取一组对应日志
        return (flag as ILayerId[])
        .map((id: ILayerId) => this.layerLogMap.get(id))
        .filter(log => log !== undefined) as ILayerLog[];
      default:
        return undefined;
    }
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
    this.layerLogMap.clear();
  }
}
