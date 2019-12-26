import { ILayerModel } from '@antv/l7-core';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import IMageModel from './image';
import NormalModel from './normal';
import TextModel from './text';

export type PointType = 'fill' | 'image' | 'normal' | 'extrude' | 'text';

const PointModels: { [key in PointType]: any } = {
  fill: FillModel,
  image: IMageModel,
  normal: NormalModel,
  extrude: ExtrudeModel,
  text: TextModel,
};

export default PointModels;
