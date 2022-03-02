import ExtrudeModel from './extrude';
import FillModel from './fill';
import FillImageModel from './fillmage';
import IconModel from './icon-font';
import IMageModel from './image';
import NormalModel from './normal';
import SimplePopint from './simplePoint';
import TextModel from './text';

export type PointType =
  | 'fillImage'
  | 'fill'
  | 'image'
  | 'normal'
  | 'simplePoint'
  | 'extrude'
  | 'text'
  | 'icon';

const PointModels: { [key in PointType]: any } = {
  fillImage: FillImageModel,
  fill: FillModel,
  image: IMageModel,
  normal: NormalModel,
  simplePoint: SimplePopint,
  extrude: ExtrudeModel,
  text: TextModel,
  icon: IconModel,
};

export default PointModels;
