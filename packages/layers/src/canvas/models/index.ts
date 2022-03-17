import CanvasModel from './canvas';
export type CanvasModelType = 'canvas';

const CanvasModels: { [key in CanvasModelType]: any } = {
  canvas: CanvasModel,
};

export default CanvasModels;
