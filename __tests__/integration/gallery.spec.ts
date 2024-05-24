import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'fujian',
    sleepTime: 1000,
  },
  {
    name: 'variFlight',
    sleepTime: 1000,
  },
];

describe('Gallery Snapshot', () => {
  generateCanvasTestCases('gallery', TEST_CASES);
});
