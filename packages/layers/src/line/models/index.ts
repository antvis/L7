import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import ArcMiniModel from './arcmini';
import GreatCircleModel from './great_circle';
import LineModel from './line';
import SimpleLineModel from './simpleLine';
import LineWallModel from './wall';

export type LineModelType =
  | 'arc'
  | 'arcmini'
  | 'arc3d'
  | 'greatcircle'
  | 'wall'
  | 'simple'
  | 'line';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arcmini: ArcMiniModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  wall: LineWallModel,
  line: LineModel,
  simple: SimpleLineModel,
};

export default LineModels;
