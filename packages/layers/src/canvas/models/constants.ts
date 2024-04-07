export type CanvasModelType = 'canvas2d' | 'webgl' | 'webgl2' | 'webgpu';

export const CanvasContextTypeMap: Record<CanvasModelType, string> = {
  canvas2d: '2d',
  webgl: 'webgl',
  webgl2: 'webgl2',
  webgpu: 'webgpu',
};
