import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'single',
  },
];

describe('Mask Snapshot', () => {
  generateCanvasTestCases('Mask', TEST_CASES);
});
