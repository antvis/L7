import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'arc',
  },
  {
    name: 'arc_plane',
    sleepTime: 500,
  },

  {
    name: 'flow',
  },
  {
    name: 'arc',
  },
  {
    name: 'dash',
    sleepTime: 500,
  },
];

describe('Line Snapshot', () => {
  generateCanvasTestCases('Line', TEST_CASES);
});
