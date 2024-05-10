import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'billboard',
  },
  {
    name: 'column',
  },
  {
    name: 'dot',
    snapshots: false,
  },
  {
    name: 'fill',
  },
  {
    name: 'fill_image',
    sleepTime: 1000,
  },
  {
    name: 'image',
    snapshots: false,
  },
  {
    name: 'text',
  },
];

describe('Point Snapshot', () => {
  generateCanvasTestCases('Point', TEST_CASES);
});
