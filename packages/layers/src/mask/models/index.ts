import MaskTileModel from '../../tile/models/tileModel';
import FillModel from './fill';

export type MaskModelType = 'fill' | 'vectorMask';

const MaskModels: { [key in MaskModelType]: any } = {
  fill: FillModel,
  vectorMask: MaskTileModel,
};
export default MaskModels;
