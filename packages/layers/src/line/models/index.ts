import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import ArcMiniModel from './arcmini';
import GreatCircleModel from './great_circle';
import LineModel from './line';
import LineWallModel from './wall';

export type LineModelType =
  | 'arc'
  | 'arcmini'
  | 'arc3d'
  | 'greatcircle'
  | 'wall'
  | 'line';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arcmini: ArcMiniModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  wall: LineWallModel,
  line: LineModel,
};

export default LineModels;
