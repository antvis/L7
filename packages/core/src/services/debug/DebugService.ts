import { EventEmitter } from 'eventemitter3';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { IDebugService, ILog, IRenderInfo } from './IDebugService';
import { IRendererService } from '../renderer/IRendererService';
import { guid } from '@antv/l7-utils';

@injectable()
export default class DebugService extends EventEmitter implements IDebugService {

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  private logMap = new Map<string, ILog>();
  private renderMap = new Map<string, IRenderInfo>();

  private enable: boolean = false;
  public renderEnable: boolean = false;
  
  setEnable(flag: boolean) {
    this.enable = !!flag;
  }

  log(key: string, values: ILog) {
    if(!this.enable) return;
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
    if(!this.enable) return;
    const canvas = this.rendererService.getCanvas();
    if(canvas) {
      canvas.addEventListener('webglcontextlost', () => this.emit('webglcontextlost'));
    }
  }

  public lostContext() {
    if(!this.enable) return;
    let gl = this.rendererService.getGLContext();
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if(loseContext) {
      loseContext.loseContext();
      // @ts-ignore
      gl = null;
    }
  }

  public generateRenderUid() {
    if(this.renderEnable) {
      return guid();
    } else {
      return '';
    }
  }

  public renderDebug(enable: boolean) {
    this.renderEnable = enable;
  }

  public renderStart(guid: string) {
    if(!this.renderEnable || !this.enable) {
      return;
    }
    const cacheRenderInfo = this.renderMap.get(guid) || {};
    this.renderMap.set(guid, {
      ...cacheRenderInfo,
      renderUid: guid,
      renderStart: Date.now(),
    })
  }

  public renderEnd(guid: string) {
    if(!this.renderEnable || !this.enable) {
      return;
    }
    const cacheRenderInfo = this.renderMap.get(guid);
    if(cacheRenderInfo) {
      const renderStart = cacheRenderInfo.renderStart as number;
      const renderEnd = Date.now();
      this.emit('renderEnd', {
        ...cacheRenderInfo,
        renderEnd,
        renderDuration: renderEnd - renderStart,
      });
      this.renderMap.delete(guid);
    }
  }

  public destroy() {
    this.logMap.clear();
    this.renderMap.clear();
  }
}
