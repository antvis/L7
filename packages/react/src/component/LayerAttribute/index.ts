import {
  IScale,
  IScaleOptions,
  ISourceCFG,
  ScaleAttributeType,
} from '@antv/l7';
import Color from './Color';
import Scale from './Scale';
import Shape from './Shape';
import Size from './Size';
import Source from './Source';
import Style from './Style';
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
}

export { Source, Size, Color, Shape, Style, Scale };
