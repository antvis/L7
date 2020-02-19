import { IActiveOption, IScale, IScaleOptions, ISourceCFG } from '@antv/l7';
import Active from './Active';
import Color from './Color';
import Filter from './Filter';
import Scales from './Scales';
import Shape from './Shape';
import Size from './Size';
import Source from './Source';
import Style from './Style';

type CallBack = (...args: any[]) => any;

export interface IAttributeOptions {
  field: string;
  value: string | number | CallBack;
  values: string[] | number[] | string | CallBack;
}

export interface IScaleAttributeOptions {
  field: string;
  value: IScale;
  values: IScaleOptions;
}
export interface IStyleOptions {
  opacity: number;
  [key: string]: any;
}

export interface ISourceOptions extends ISourceCFG {
  data: any;
}

export interface IActiveOptions {
  option: IActiveOption | boolean;
}
export interface ILayerProps {
  options?: {
    [key: string]: any;
  };
  source: ISourceOptions;
  color: Partial<IAttributeOptions>;
  shape: Partial<IAttributeOptions>;
  scales?: Partial<IScaleAttributeOptions>;
  size?: Partial<IAttributeOptions>;
  style?: Partial<IStyleOptions>;
  active?: IActiveOptions;
  filter?: Partial<IAttributeOptions>;
}

export { Active, Color, Filter, Source, Size, Shape, Style, Scales };
