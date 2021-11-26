import HeatMapModel from './wind';

export type WindModelType = 'heatmap';

const WindModels: { [key in WindModelType]: any } = {
  heatmap: HeatMapModel,
};
export default WindModels;
