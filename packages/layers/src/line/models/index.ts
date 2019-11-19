import ArcModel from './arc';
import Arc3DModel from './arc_3d';
import GreatCircleModel from './great_circle';
import LineModel from './line';

export type LineModelType = 'arc' | 'arc3d' | 'greatcircle' | 'line';

const LineModels: { [key in LineModelType]: any } = {
  arc: ArcModel,
  arc3d: Arc3DModel,
  greatcircle: GreatCircleModel,
  line: LineModel,
};

export default LineModels;
