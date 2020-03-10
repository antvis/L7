import {
  BlendType,
  IActiveOption,
  ILayer,
  IScale,
  IScaleOptions,
  ISourceCFG,
  Scene,
} from '@antv/l7';
import * as React from 'react';
import Active from './Active';
import Color from './Color';
import Filter from './Filter';
import Scale from './Scale';
import Select from './Select';
import Shape from './Shape';
import Size from './Size';
import Source from './Source';
import Style from './Style';

type CallBack = (...args: any[]) => any;

export interface IAttributeOptions {
  field: string;
  value: string | number;
  values: string[] | number[] | string | number | CallBack;
  scale?: string;
  blend: keyof typeof BlendType;
  options?: {
    [key: string]: any;
  };
}

export interface IScaleAttributeOptions {
  field: string | IScaleOptions;
  value: IScale;
  values: IScaleOptions | IScale;
}
export interface ILayerOption {
  name?: string;
  visible: boolean;
  zIndex: number;
  minZoom: number;
  maxZoom: number;
  autoFit: boolean;
  blend: keyof typeof BlendType;
  [key: string]: any;
}
export interface IScaleOption {
  [key: string]: IScaleAttributeOptions;
}
export interface IStyleOptions {
  opacity: number;
  [key: string]: any;
}

export interface ISourceOptions extends ISourceCFG {
  data: any;
  // 每次更新数据之后是否自适应缩放
  autoFit?: boolean;
}

export interface IActiveOptions {
  option: IActiveOption | boolean;
}
export interface ILayerProps {
  options?: Partial<ILayerOption>;
  source: ISourceOptions;
  color: Partial<IAttributeOptions>;
  shape: Partial<IAttributeOptions>;
  scale?: Partial<IScaleAttributeOptions>;
  size?: Partial<IAttributeOptions>;
  style?: Partial<IStyleOptions>;
  active?: IActiveOptions;
  select?: IActiveOptions;
  filter?: Partial<IAttributeOptions>;
  onLayerLoaded?: (layer: ILayer, scene: Scene) => void;
  children?: React.ReactNode;
}

export { Active, Color, Filter, Source, Size, Shape, Style, Scale, Select };
