// @ts-ignore
import { SyncHook } from '@antv/async-hook';
import {
  IClusterOptions,
  IParseDataItem,
  IParserCfg,
  IParserData,
  ISource,
  ISourceCFG,
  ITileParserCFG,
  ITransform,
} from '@antv/l7-core';
import {
  bBoxToBounds,
  extent,
  padBounds,
  SourceTile,
  TilesetManager,
} from '@antv/l7-utils';
import { BBox } from '@turf/helpers';
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
//
export default class Source extends EventEmitter implements ISource {
  public type: string = 'source';
  public isTile: boolean = false;
  public inited: boolean = false;
  public data: IParserData;
  public center: [number, number];
  // 数据范围
  public extent: BBox;
  // 生命周期钩子
  public hooks = {
    init: new SyncHook(),
  };
  public getSourceCfg() {
    return this.cfg;
  }
  public parser: IParserCfg | ITileParserCFG = { type: 'geojson' };
  public transforms: ITransform[] = [];
  public cluster: boolean = false;
  public clusterOptions: Partial<IClusterOptions> = {
    enable: false,
    radius: 40,
    maxZoom: 20,
    zoom: -99,
    method: 'count',
  };

  // 瓦片数据管理器
  public tileset: TilesetManager | undefined;
  // 是否有效范围
  private invalidExtent: boolean = false;

  private dataArrayChanged: boolean = false;

  // 原始数据
  protected originData: any;
  protected rawData: any;
  private cfg: Partial<ISourceCFG> = {
    autoRender: true,
  };

  private clusterIndex: Supercluster;

  constructor(data: any | ISource, cfg?: ISourceCFG) {
    super();
    // this.rawData = cloneDeep(data);
    this.originData = data;
    this.initCfg(cfg);

    this.init().then(() => {
      this.inited = true;
      this.emit('update', {
        type: 'inited',
      });
    });
  }

  public getClusters(zoom: number): any {
    return this.clusterIndex.getClusters(this.caculClusterExtent(2), zoom);
  }

  public getClustersLeaves(id: number): any {
    return this.clusterIndex.getLeaves(id, Infinity);
  }

  public getParserType() {
    return this.parser.type;
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
    const { type = 'geojson', geometry } = this.parser as IParserCfg;
    if (type === 'geojson' && !this.cluster) {
      const feature =
        id < this.originData.features.length
          ? this.originData.features[id]
          : 'null';
      const newFeature = cloneDeep(feature);

      if (
        newFeature?.properties &&
        (this.transforms.length !== 0 || this.dataArrayChanged)
      ) {
        // 如果数据进行了transforms 属性会发生改变 或者数据dataArray发生更新
        const item = this.data.dataArray.find((dataItem: IParseDataItem) => {
          return dataItem._id === id;
        });
        newFeature.properties = item;
      }
      return newFeature;
    } else if (type === 'json' && geometry) {
      return this.data.dataArray.find((dataItem) => dataItem._id === id);
    } else {
      return id < this.data.dataArray.length ? this.data.dataArray[id] : 'null';
    }
  }

  public updateFeaturePropertiesById(
    id: number,
    properties: Record<string, any>,
  ) {
    this.data.dataArray = this.data.dataArray.map(
      (dataItem: IParseDataItem) => {
        if (dataItem._id === id) {
          return {
            ...dataItem,
            ...properties,
          };
        }
        return dataItem;
      },
    );
    this.dataArrayChanged = true;
    this.emit('update', {
      type: 'update',
    });
  }

  public getFeatureId(field: string, value: any): number | undefined {
    const feature = this.data.dataArray.find((dataItem: IParseDataItem) => {
      return dataItem[field] === value;
    });
    return feature?._id;
  }

  public setData(data: any, options?: ISourceCFG) {
    this.originData = data;
    this.dataArrayChanged = false;
    this.initCfg(options);

    this.init().then(() => {
      this.emit('update', {
        type: 'update',
      });
    });
  }

  public reloadAllTile() {
    this.tileset?.reloadAll();
  }

  public reloadTilebyId(z: number, x: number, y: number): void {
    this.tileset?.reloadTileById(z, x, y);
  }

  public reloadTileByLnglat(lng: number, lat: number, z: number): void {
    this.tileset?.reloadTileByLnglat(lng, lat, z);
  }

  public getTileExtent(
    e: [number, number, number, number],
    zoom: number,
  ): Array<{ x: number; y: number; z: number }> | undefined {
    return this.tileset?.getTileExtent(e, zoom);
  }

  public getTileByZXY(z: number, x: number, y: number): SourceTile | undefined {
    return this.tileset?.getTileByZXY(z, x, y);
  }

  public reloadTileByExtent(
    bounds: [number, number, number, number],
    z: number,
  ): void {
    this.tileset?.reloadTileByExtent(bounds, z);
  }

  public destroy() {
    this.removeAllListeners();
    this.originData = null;
    this.clusterIndex = null;
    // @ts-ignore
    this.data = null;
    this.tileset?.destroy();
  }

  private async processData() {
    return new Promise((resolve, reject) => {
      try {
        this.excuteParser();
        this.initCluster();
        this.executeTrans();
        resolve({});
      } catch (err) {
        reject(err);
      }
    });
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

  private async init() {
    this.inited = false;
    await this.processData();
    this.inited = true;
  }

  /**
   * 数据解析
   */
  private excuteParser(): void {
    // 耗时计算测试
    const parser = this.parser as IParserCfg;
    const type: string = parser.type || 'geojson';
    const sourceParser = getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 为瓦片图层的父图层创建数据瓦片金字塔管理器
    this.tileset = this.initTileset();

    // 判断当前 source 是否需要计算范围
    if (parser.cancelExtent) {
      return;
    }

    // 计算范围
    this.extent = extent(this.data.dataArray);
    this.setCenter(this.extent);
    this.invalidExtent =
      this.extent[0] === this.extent[2] || this.extent[1] === this.extent[3];
  }

  private setCenter(bbox: BBox) {
    this.center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
    if (isNaN(this.center[0]) || isNaN(this.center[1])) {
      // this.center = [NaN, NaN] // Infinity - Infinity = NaN
      // 默认设置为大地原点
      this.center = [108.92361111111111, 34.54083333333333];
    }
  }

  /**
   * 瓦片数据管理器
   */
  private initTileset() {
    const { tilesetOptions } = this.data;
    if (!tilesetOptions) {
      return;
    }
    this.isTile = true;
    if (this.tileset) {
      this.tileset.updateOptions(tilesetOptions);
      return this.tileset;
    }

    const tileset = new TilesetManager({
      ...tilesetOptions,
    });
    return tileset;
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

  /**
   * 数据聚合
   */
  private initCluster() {
    if (!this.cluster) {
      return;
    }

    const clusterOptions = this.clusterOptions || {};
    this.clusterIndex = cluster(this.data, clusterOptions);
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
}
