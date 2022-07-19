import LineTileModel from '../../tile/models/tileModel';
import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import EarthArc3DModel from './earthArc_3d';
import GreatCircleModel from './great_circle';
import LineHalfModel from './half';
import LineModel from './line';
import LinearLine from './linearline';
import SimpleLineModel from './simpleLine';
import TileLineModel from './tile';
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
  | 'vectorline'
  | 'tileLine'
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
  vectorline: LineTileModel,
  tileLine: TileLineModel,
  earthArc3d: EarthArc3DModel,
};

export default LineModels;
