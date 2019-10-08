import { extent } from '@l7/utils';
import { BBox, FeatureCollection, Geometries, Properties } from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { cloneDeep } from 'lodash';
import { getParser } from './';
import { IDictionary, IParserData, ISourceCFG } from './interface';
export default class Source extends EventEmitter {
  public data: IParserData;

  // 数据范围
  public extent: BBox;
  private attrs: IDictionary<any> = {};

  // 原始数据
  private originData: any;
  constructor(data: any, cfg?: ISourceCFG) {
    super();
    this.set('data', data);
    Object.assign(this.attrs, cfg);
    this.originData = cloneDeep(this.get('data'));
    this.init();
  }

  public get(name: string): any {
    return this.attrs[name];
  }
  public set(name: string, value: any) {
    this.attrs[name] = value;
  }
  private excuteParser(): void {
    const parser = this.get('parser') || {};
    const type: string = parser.type || 'geojson';
    const sourceParser = getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 计算范围
    this.extent = extent(this.data.dataArray);
  }
  private init() {
    this.excuteParser(); // 数据解析
  }
}
