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
    snapshot: false,
  },
  {
    name: 'fill',
  },
  {
    name: 'fillImage',
  },
  {
    name: 'image',
    snapshot: false,
  },
  {
    name: 'text',
  },
];

describe('Point Snapshot', () => {
  generateCanvasTestCases('point', TEST_CASES);
});
