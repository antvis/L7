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
  generateCanvasTestCases('point', TEST_CASES);
});
