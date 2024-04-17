import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'arc',
    sleepTime: 500,
  },
  {
    name: 'arc_plane',
    sleepTime: 500,
  },
  {
    name: 'arc',
    sleepTime: 600,
  },
  {
    name: 'dash',
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
