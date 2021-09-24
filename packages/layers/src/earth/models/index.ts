import { ILayerModel } from '@antv/l7-core';
import BaseEarthModel from './base';

export type EarthType = 'base';

const EarthModels: { [key in EarthType]: any } = {
  base: BaseEarthModel,
};

export default EarthModels;
