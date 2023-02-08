export type ILayerId = string;
export type ILayerLogType = 'layerInitStart' | 'layerInitEnd' | 'sourceInitStart';
export interface ILayerLog { // 记录 layer 创建过程中的信息
  type?: string;						// layer type
  
  layerInitStart?: number;	// layer 创建时间
  layerInitEnd?: number;		// layer 创建完成时间
  sourceInitStart?: number;	// source 创建时间
  sourceInitEnd?: number;		// source 创建完成时间
  mappingStart?: number;		// 数据开始映射时间
  mappingEnd?: number;			// 数据映射完成时间
  buildModelStart?: number; // 开始创建渲染对象时间
  buildModenEnd?: number;		// 渲染对象创建完成时间

  id?: string;							// layer id
  encodeDataCount?: number;	// 渲染数据的长度
}

export interface IMapLog {
  type?: string;
  mapInitStart?: number;
}

export interface IDebugService {
  mapLog(logs: IMapLog): void;
  getMapLog(): IMapLog;

  layerLog(id: ILayerId, layerLogs: ILayerLog): void;
  getLayerLog(flag: undefined | ILayerId | ILayerId[]): ILayerLog | ILayerLog[] | undefined;
  removeLayerLog(id: ILayerId): void;

  registerContextLost(): void;
  lostContext(): void;
}
