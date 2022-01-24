import ExtrudeModel from './extrude';
import FillModel from './fill';
import IconModel from './icon-font';
import IMageModel from './image';
import NormalModel from './normal';
import SimplePopint from './simplePoint';
import TextModel from './text';

export type PointType =
  | 'fill'
  | 'image'
  | 'normal'
  | 'simplePoint'
  | 'extrude'
  | 'text'
  | 'icon';

const PointModels: { [key in PointType]: any } = {
  fill: FillModel,
  image: IMageModel,
  normal: NormalModel,
  simplePoint: SimplePopint,
  extrude: ExtrudeModel,
  text: TextModel,
  icon: IconModel,
};

export default PointModels;
