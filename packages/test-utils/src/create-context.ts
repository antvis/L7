import gl from 'gl';

// borrow from regl
// @see https://github.com/regl-project/regl/blob/gh-pages/test/util/create-context.js#L28
const CONTEXT = gl(400, 300, { preserveDrawingBuffer: true });

// @ts-ignore
const RESIZE = CONTEXT.getExtension('STACKGL_resize_drawingbuffer');

// @ts-ignore
export default function (width: number, height: number) {
  resize(width, height);
  return CONTEXT;
}

export function resize(width: number, height: number) {
  if (RESIZE) {
    RESIZE.resize(width, height);
  }
}

export function destroy() {
  //
}
