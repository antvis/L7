import GridModel from './grid';
import Grid3DModel from './grid3d';
import HeatMapModel from './heatmap';
import HexagonModel from './hexagon';

export type HeatMapModelType = 'heatmap' | 'heatmap3d' | 'hexagon' | 'grid' | 'grid3d';

const HeatMapModels: { [key in HeatMapModelType]: any } = {
  heatmap: HeatMapModel,
  heatmap3d: HeatMapModel,
  grid: GridModel,
  grid3d: Grid3DModel,
  hexagon: HexagonModel,
};
export default HeatMapModels;
