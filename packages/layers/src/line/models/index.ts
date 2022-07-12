import LineTileModel from '../../tile/models/tileModel';
import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import ArcMiniModel from './arcmini';
import GreatCircleModel from './great_circle';
import LineHalfModel from './half';
import LineModel from './line';
import LinearLine from './linearline';
import SimpleLineModel from './simpleLine';
import TileLineModel from './tile';
import LineWallModel from './wall';

export type LineModelType =
  | 'arc'
  | 'arcmini'
  | 'arc3d'
  | 'greatcircle'
  | 'wall'
  | 'simple'
  | 'line'
  | 'halfLine'
  | 'linearline'
  | 'vectorline'
  | 'tileLine';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arcmini: ArcMiniModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  wall: LineWallModel,
  line: LineModel,
  halfLine: LineHalfModel,
  simple: SimpleLineModel,
  linearline: LinearLine,
  vectorline: LineTileModel,
  tileLine: TileLineModel,
};

export default LineModels;
