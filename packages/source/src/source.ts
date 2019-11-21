import { IParserCfg, IParserData, ISourceCFG, ITransform } from '@l7/core';
import { extent } from '@l7/utils';
import { BBox, FeatureCollection, Geometries, Properties } from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { cloneDeep } from 'lodash';
import { SyncHook } from 'tapable';
import { getParser, getTransform } from './';
export default class Source extends EventEmitter {
  public data: IParserData;

  // 数据范围
  public extent: BBox;
  // 生命周期钩子
  public hooks = {
    init: new SyncHook(['source']),
    layout: new SyncHook(['source']),
    update: new SyncHook(['source']),
  };
  public parser: IParserCfg = { type: 'geojson' };
  public transforms: ITransform[] = [];

  // 原始数据
  private originData: any;
  constructor(data: any, cfg?: ISourceCFG) {
    super();
    this.data = cloneDeep(data);
    this.originData = data;
    if (cfg) {
      if (cfg.parser) {
        this.parser = cfg.parser;
      }
      if (cfg.transforms) {
        this.transforms = cfg.transforms;
      }
    }
    this.hooks.init.tap('parser', () => {
      this.excuteParser();
    });
    this.hooks.init.tap('transform', () => {
      this.executeTrans();
    });
    this.init();
  }
  private excuteParser(): void {
    const parser = this.parser;
    const type: string = parser.type || 'geojson';
    const sourceParser = getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 计算范围
    this.extent = extent(this.data.dataArray);
  }
  /**
   * 数据统计
   */
  private executeTrans() {
    const trans = this.transforms;
    trans.forEach((tran: ITransform) => {
      const { type } = tran;
      const data = getTransform(type)(this.data, tran);
      Object.assign(this.data, data);
    });
  }
  private init() {
    this.hooks.init.call(this);
  }
}
