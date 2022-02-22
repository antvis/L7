import FillModel from './fill';

export type MaskModelType = 'fill';

const MaskModels: { [key in MaskModelType]: any } = {
  fill: FillModel,
};
export default MaskModels;
