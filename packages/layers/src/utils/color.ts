import * as d3 from 'd3-color';
export function rgb2arr(str: string) {
  const color = d3.color(str) as d3.RGBColor;
  const arr = [0, 0, 0, 0];
  if (color != null) {
    arr[0] = color.r / 255;
    arr[1] = color.g / 255;
    arr[2] = color.b / 255;
    arr[3] = color.opacity;
  }
  return arr;
}
