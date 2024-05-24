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
    sleepTime: 500,
  },
  {
    name: 'wall',
  },
  {
    name: 'arc',
    sleepTime: 500,
  },
  {
    name: 'arc3D',
    sleepTime: 1000,
  },
  {
    name: 'greatcircle',
    sleepTime: 500,
  },
  {
    name: 'flow',
    sleepTime: 1000,
  },
];

describe('Line Snapshot', () => {
  generateCanvasTestCases('line', TEST_CASES);
});
