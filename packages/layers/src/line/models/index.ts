import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import EarthArc3DModel from './earthArc_3d';
import GreatCircleModel from './great_circle';
import LineHalfModel from './half';
import LineModel from './line';
import LinearLine from './linearline';
import SimpleLineModel from './simpleLine';
import LineWallModel from './wall';

export type LineModelType =
  | 'arc'
  | 'arc3d'
  | 'greatcircle'
  | 'wall'
  | 'simple'
  | 'line'
  | 'halfLine'
  | 'linearline'
  | 'earthArc3d';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  wall: LineWallModel,
  line: LineModel,
  halfLine: LineHalfModel,
  simple: SimpleLineModel,
  linearline: LinearLine,
  earthArc3d: EarthArc3DModel,
};

export default LineModels;
