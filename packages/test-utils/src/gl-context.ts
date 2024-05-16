import gl from 'gl';

/** Test context */
export const glContext = gl(1, 1, {
  preserveDrawingBuffer: true,
  antialias: false,
  stencil: true,
});
