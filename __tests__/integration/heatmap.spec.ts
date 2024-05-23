import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'normal',
  },
  {
    name: 'grid',
    snapshots: false,
  },
  {
    name: 'hexagon',
    snapshots: false,
  },
];

describe('Heatmap Snapshot', () => {
  generateCanvasTestCases('heatmap', TEST_CASES);
});
