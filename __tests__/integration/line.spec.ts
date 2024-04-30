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
    snapshots: false,
    sleepTime: 500,
  },
  {
    name: 'wall',
    sleepTime: 1000,
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
    snapshots: false,
    sleepTime: 500,
  },
  {
    name: 'flow',
    sleepTime: 1000,
  },
];

describe('Line Snapshot', () => {
  generateCanvasTestCases('Line', TEST_CASES);
});
