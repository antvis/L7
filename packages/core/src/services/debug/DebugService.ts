import { guid } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import type { IDebugService, ILog, IRenderInfo } from './IDebugService';

export default class DebugService extends EventEmitter implements IDebugService {
  private renderMap = new Map<string, IRenderInfo>();

  private enable: boolean = false;
  public renderEnable: boolean = false;

  public setEnable(flag: boolean) {
    this.enable = !!flag;
  }

  private cacheLogs: any = {};

  public log(key: string, values: ILog) {
    if (!this.enable) {
      return;
    }
    const keys = key.split('.'); // [12, init, layerInitStart]
    let parent: any = null;
    keys.forEach((k, i) => {
      if (parent !== null) {
        if (!parent[k]) {
          parent[k] = {};
        }
        if (i !== keys.length - 1) {
          parent = parent[k];
        }
      } else {
        if (!this.cacheLogs[k]) {
          this.cacheLogs[k] = {};
        }
        if (i !== keys.length - 1) {
          parent = this.cacheLogs[k];
        }
      }

      if (i === keys.length - 1) {
        parent[k] = {
          time: Date.now(),
          ...parent[k],
          ...values,
        };
      }
    });
  }

  public getLog(key?: string | string[]) {
    switch (typeof key) {
      case 'string':
        return this.cacheLogs[key];
      case 'object':
        return (key as string[])
          .map((k) => this.cacheLogs[k])
          .filter((o) => o !== undefined) as ILog[];
      case 'undefined':
        return this.cacheLogs;
    }
  }

  /**
   * 删除日志
   * @param key
   */
  public removeLog(key: string) {
    delete this.cacheLogs[key];
  }

  public generateRenderUid() {
    if (this.renderEnable) {
      return guid();
    } else {
      return '';
    }
  }

  public renderDebug(enable: boolean) {
    this.renderEnable = enable;
  }

  public renderStart(id: string) {
    if (!this.renderEnable || !this.enable) {
      return;
    }
    const cacheRenderInfo = this.renderMap.get(id) || {};
    this.renderMap.set(id, {
      ...cacheRenderInfo,
      renderUid: id,
      renderStart: Date.now(),
    });
  }

  public renderEnd(id: string) {
    if (!this.renderEnable || !this.enable) {
      return;
    }
    const cacheRenderInfo = this.renderMap.get(id);
    if (cacheRenderInfo) {
      const renderStart = cacheRenderInfo.renderStart as number;
      const renderEnd = Date.now();
      this.emit('renderEnd', {
        ...cacheRenderInfo,
        renderEnd,
        renderDuration: renderEnd - renderStart,
      });
      this.renderMap.delete(id);
    }
  }

  public destroy() {
    this.cacheLogs = null;
    this.renderMap.clear();
  }
}
