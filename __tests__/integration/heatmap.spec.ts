import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'normal',
    sleepTime: 1000,
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
  generateCanvasTestCases('Heatmap', TEST_CASES);
});
