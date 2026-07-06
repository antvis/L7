import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import FlowLineModel from './flow';
import GreatCircleModel from './great_circle';
import LineModel from './line';
import SimpleLineModel from './simple_line';
import LineWallModel from './wall';

export type LineModelType =
  | 'arc'
  | 'arc3d'
  | 'greatcircle'
  | 'flowline'
  | 'wall'
  | 'simple'
  | 'line'
  | 'earthArc3d';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  wall: LineWallModel,
  line: LineModel,
  simple: SimpleLineModel,
  flowline: FlowLineModel,
  earthArc3d: Arc3DModel,
};

export default LineModels;
