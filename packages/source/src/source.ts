// @ts-ignore
import { SyncHook } from '@antv/async-hook';
import {
  IClusterOptions,
  IMapService,
  IParseDataItem,
  IParserCfg,
  IParserData,
  ISource,
  ISourceCFG,
  ITransform,
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import { bBoxToBounds, extent, padBounds } from '@antv/l7-utils';
import {
  BBox,
  Feature,
  FeatureCollection,
  Geometries,
  Properties,
} from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { cloneDeep, isFunction, isString, mergeWith } from 'lodash';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Supercluster from 'supercluster/dist/supercluster';
import { getParser, getTransform } from './factory';
import { cluster } from './transform/cluster';
import { statMap } from './utils/statistics';
import { getColumn } from './utils/util';

function mergeCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}

export default class Source extends EventEmitter implements ISource {
  public data: IParserData;

  // 数据范围
  public extent: BBox;
  // 生命周期钩子
  public hooks = {
    init: new SyncHook(),
  };

  public parser: IParserCfg = { type: 'geojson' };
  public transforms: ITransform[] = [];
  public cluster: boolean = false;
  public clusterOptions: Partial<IClusterOptions> = {
    enable: false,
    radius: 40,
    maxZoom: 20,
    zoom: -99,
    method: 'count',
  };
  private readonly mapService: IMapService;
  // 是否有效范围
  private invalidExtent: boolean = false;

  // 原始数据
  private originData: any;
  private rawData: any;
  private cfg: any = {};

  private clusterIndex: Supercluster;

  constructor(data: any | ISource, cfg?: ISourceCFG) {
    super();
    // this.rawData = cloneDeep(data);
    this.originData = data;
    this.initCfg(cfg);

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

  public setData(data: any, options?: ISourceCFG) {
    this.rawData = data;
    this.originData = data;
    this.initCfg(options);
    this.init();
    this.emit('update');
  }
  public getClusters(zoom: number): any {
    return this.clusterIndex.getClusters(this.caculClusterExtent(2), zoom);
  }
  public getClustersLeaves(id: number): any {
    return this.clusterIndex.getLeaves(id, Infinity);
  }
  public updateClusterData(zoom: number): void {
    const { method = 'sum', field } = this.clusterOptions;
    let data = this.clusterIndex.getClusters(
      this.caculClusterExtent(2),
      Math.floor(zoom),
    );
    this.clusterOptions.zoom = zoom;
    data.forEach((p: any) => {
      if (!p.id) {
        p.properties.point_count = 1;
      }
    });
    if (field || isFunction(method)) {
      data = data.map((item: any) => {
        const id = item.id as number;
        if (id) {
          const points = this.clusterIndex.getLeaves(id, Infinity);
          const properties = points.map((d: any) => d.properties);
          let statNum;
          if (isString(method) && field) {
            const column = getColumn(properties, field);
            statNum = statMap[method](column);
          }
          if (isFunction(method)) {
            statNum = method(properties);
          }
          item.properties.stat = statNum;
        } else {
          item.properties.point_count = 1;
        }
        return item;
      });
    }
    this.data = getParser('geojson')({
      type: 'FeatureCollection',
      features: data,
    });
    this.executeTrans();
  }
  public getFeatureById(id: number): unknown {
    const { type = 'geojson' } = this.parser;
    if (type === 'geojson' && !this.cluster) {
      const feature =
        id < this.originData.features.length
          ? this.originData.features[id]
          : 'null';
      const newFeature = cloneDeep(feature);
      if (this.transforms.length !== 0) {
        const item = this.data.dataArray.find((dataItem: IParseDataItem) => {
          return dataItem._id === id;
        });
        newFeature.properties = item;
      }
      return newFeature;
    } else {
      return id < this.data.dataArray.length ? this.data.dataArray[id] : 'null';
    }
  }

  public getFeatureId(field: string, value: any): number | undefined {
    const feature = this.data.dataArray.find((dataItem: IParseDataItem) => {
      return dataItem[field] === name;
    });
    return feature?._id;
  }

  public destroy() {
    this.removeAllListeners();
    this.originData = null;
    this.clusterIndex = null;
    // @ts-ignore
    this.data = null;
  }

  private caculClusterExtent(bufferRatio: number): any {
    let newBounds = [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ];

    if (!this.invalidExtent) {
      newBounds = padBounds(bBoxToBounds(this.extent), bufferRatio);
    }
    return newBounds[0].concat(newBounds[1]);
  }

  private initCfg(option?: ISourceCFG) {
    this.cfg = mergeWith(this.cfg, option, mergeCustomizer);
    const cfg = this.cfg;
    if (cfg) {
      if (cfg.parser) {
        this.parser = cfg.parser;
      }
      if (cfg.transforms) {
        this.transforms = cfg.transforms;
      }
      this.cluster = cfg.cluster || false;
      if (cfg.clusterOptions) {
        this.cluster = true;
        this.clusterOptions = {
          ...this.clusterOptions,
          ...cfg.clusterOptions,
        };
      }
    }
  }
  private excuteParser(): void {
    const parser = this.parser;
    const type: string = parser.type || 'geojson';
    // TODO: 图片瓦片地图组件只需要使用 url 参数
    if (type === 'imagetile') {
      this.data = {
        tileurl: this.originData,
        dataArray: [],
      };
      return;
    }
    const sourceParser = getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 计算范围
    this.extent = extent(this.data.dataArray);
    this.invalidExtent =
      this.extent[0] === this.extent[2] || this.extent[1] === this.extent[3];
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

    const clusterOptions = this.clusterOptions || {};
    this.clusterIndex = cluster(this.data, clusterOptions);
  }

  private init() {
    this.hooks.init.call(this);
  }
}
