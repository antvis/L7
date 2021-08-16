import regl from 'l7regl';

// borrow from https://github.com/regl-project/regl/blob/gh-pages/test/attributes.js#L303-L311
export default function checkPixels(
  reGL: regl.Regl,
  expected: number[],
): boolean {
  const actual = reGL.read();
  for (let i = 0; i < 1 * 1; ++i) {
    if (actual[4 * i] !== expected[i]) {
      return false;
    }
  }
  return true;
}
