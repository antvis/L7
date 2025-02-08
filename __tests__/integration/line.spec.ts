import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'simple',
  },
  {
    name: 'normal',
  },
  {
    name: 'dash',
    snapshot: false,
  },
  {
    name: 'wall',
  },
  {
    name: 'arc',
  },
  {
    name: 'arc3D',
  },
  {
    name: 'greatcircle',
  },
  {
    name: 'flow',
    sleepTime: 500,
  },
];

describe('Line Snapshot', () => {
  generateCanvasTestCases('line', TEST_CASES);
});
