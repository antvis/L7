import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'normal',
  },
  {
    name: 'grid',
  },
  {
    name: 'hexagon',
  },
];

describe('Heatmap Snapshot', () => {
  generateCanvasTestCases('heatmap', TEST_CASES);
});
