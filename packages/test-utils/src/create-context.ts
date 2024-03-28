import type createContext from 'gl';
import gl from 'gl';

let CONTEXT: WebGLRenderingContext & createContext.StackGLExtension;

export function createGLContext(width: number, height: number) {
  if (CONTEXT) return CONTEXT;
  // borrow from regl
  // @see https://github.com/regl-project/regl/blob/gh-pages/test/util/create-context.js#L28
  CONTEXT = gl(width, height, { preserveDrawingBuffer: true });
  return CONTEXT;
}

export function resizeGL(width: number, height: number) {
  // @note: is not support when run CI in ubuntu
  const RESIZE = CONTEXT.getExtension('STACKGL_resize_drawingbuffer');
  if (RESIZE) {
    RESIZE.resize(width, height);
  }
}

export function destroGLContexty() {
  //
}
