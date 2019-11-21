export const sdf2DFunctions = [
  'circle',
  'triangle',
  'square',
  'pentagon',
  'hexagon',
  'octogon',
  'hexagram',
  'rhombus',
  'vesica',
];

export function getShapeIndex(shape: string): number {
  return sdf2DFunctions.indexOf(shape);
}
