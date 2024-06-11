import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'single',
  },
  {
    name: 'multi',
    sleepTime: 2500,
  },
];

describe('Mask Snapshot', () => {
  generateCanvasTestCases('mask', TEST_CASES);
});
