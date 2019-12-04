import {
  IClusterOptions,
  IParserCfg,
  IParserData,
  ISourceCFG,
  ITransform,
} from '@antv/l7-core';
import { extent } from '@antv/l7-utils';
import {
  BBox,
  Feature,
  FeatureCollection,
  Geometries,
  Properties,
} from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { cloneDeep, isString, isFunction } from 'lodash';
import Supercluster from 'supercluster';
import { SyncHook } from 'tapable';
import { getParser, getTransform } from './';
import { statMap } from './utils/statistics';
import { getColumn } from './utils/util';

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
  private rawData: any;
  private clusterOptions: Partial<IClusterOptions> = {
    enable: false,
    radius: 40,
    maxZoom: 20,
    method: 'count',
  };
  private cluster: boolean = false;
  private clusterIndex: Supercluster;

  constructor(data: any, cfg?: ISourceCFG) {
    super();
    this.rawData = cloneDeep(data);
    this.originData = data;
    if (cfg) {
      if (cfg.parser) {
        this.parser = cfg.parser;
      }
      if (cfg.transforms) {
        this.transforms = cfg.transforms;
      }
      if (cfg.clusterOptions) {
        this.cluster = true;
        this.clusterOptions = {
          ...this.clusterOptions,
          ...cfg.clusterOptions,
        };
      }
    }

    this.hooks.init.tap('parser', () => {
      this.excuteParser();
    });
    this.hooks.init.tap('cluster', () => {
      this.initCluster();
    });
    this.hooks.init.tap('transform', () => {
      this.executeTrans();
    });
    this.init();
  }

  public updateClusterData(
    zoom: number,
    bbox: [number, number, number, number],
  ): any {
    const { method = 'sum', field } = this.clusterOptions;
    const data = this.clusterIndex.getClusters(bbox, zoom);
    if (!field && !isFunction(method)) {
      return;
    }

    const clusterdata = data.map((item) => {
      const id = item.id as number;
      if (id) {
        const points = this.clusterIndex.getLeaves(id, Infinity);
        const properties = points.map((d) => d.properties);
        let statNum;
        if (isString(method) && field) {
          const column = getColumn(properties, field);
          statNum = statMap[method](column);
        }
        if (isFunction(method)) {
          statNum = method(properties);
        }
        item.properties.stat = statNum;
      }

      return item;
    });

    this.data = getParser('geojson')({
      type: 'FeatureCollection',
      features: clusterdata,
    });
    this.executeTrans();
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

  private initCluster() {
    if (!this.cluster) {
      return;
    }
    const { radius, minZoom = 0, maxZoom } = this.clusterOptions;
    this.clusterIndex = new Supercluster({
      radius,
      minZoom,
      maxZoom,
    });
    this.clusterIndex.load(this.rawData.features);
  }

  private init() {
    this.hooks.init.call(this);
  }
}
