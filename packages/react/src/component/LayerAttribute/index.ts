import { IActiveOption, IScale, IScaleOptions, ISourceCFG } from '@antv/l7';
import Active from './Active';
import Color from './Color';
import Filter from './Filter';
import Scale from './Scale';
import Shape from './Shape';
import Size from './Size';
import Source from './Source';
import Style from './Style';

type CallBack = (...args: any[]) => any;

export interface IAttributeOptions {
  field: string;
  value: string | number;
  values: string[] | number[] | string;
  scale?: string;
}

export interface IScaleAttributeOptions {
  field: string | IScaleOptions;
  value: IScale;
  values: IScaleOptions;
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
  scale?: Partial<IScaleAttributeOptions>;
  size?: Partial<IAttributeOptions>;
  style?: Partial<IStyleOptions>;
  active?: IActiveOptions;
  filter?: Partial<IAttributeOptions>;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}

export { Active, Color, Filter, Source, Size, Shape, Style, Scale };
