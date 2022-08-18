import { Version } from '../interface/map';
export type Source = any;
export type ILineShape = 'line' | 'arc' | 'arc3d' | 'greatcircle';
export type IThetaOffset = string | number | undefined;
export type Point = number[];

export interface ILineAtOffset {
  offset: number;
  shape: ILineShape;
  mapVersion: Version;
  thetaOffset?: IThetaOffset;
  featureId?: number | undefined;
  segmentNumber?: number;
  autoFit?: boolean;
}
