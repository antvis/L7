import WindModel from './wind';
export type WindModelType = 'wind';

const WindModels: { [key in WindModelType]: any } = {
  wind: WindModel,
};
export default WindModels;
