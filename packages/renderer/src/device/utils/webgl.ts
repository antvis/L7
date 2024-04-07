// @see https://github.com/visgl/luma.gl/blob/30a1039573576d73641de7c1ba222e8992eb526e/modules/gltools/src/utils/webgl-checks.ts#L22
export function isWebGL2(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
): gl is WebGL2RenderingContext {
  if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
    return true;
  }
  // Look for debug contexts, headless gl etc
  // @ts-ignore
  return Boolean(gl && gl._version === 2);
}
