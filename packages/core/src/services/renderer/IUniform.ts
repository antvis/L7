import { IFramebuffer } from './IFramebuffer';
import { ITexture2D } from './ITexture2D';

interface IStruct {
  [structPropName: string]: number | number[] | boolean | IStruct | IStruct[];
}

export type IUniform =
  | number
  | number[]
  | ArrayBufferView
  | boolean
  | IFramebuffer
  | ITexture2D
  | IStruct;
