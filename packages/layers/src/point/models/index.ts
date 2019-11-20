import { ILayerModel } from '@l7/core';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import IMageModel from './image';
import NormalModel from './normal';

export type PointType = 'fill' | 'image' | 'normal' | 'extrude' | 'text';

const PointModels: { [key in PointType]: any } = {
  fill: FillModel,
  image: IMageModel,
  normal: NormalModel,
  extrude: ExtrudeModel,
  text: null,
};

export default PointModels;
