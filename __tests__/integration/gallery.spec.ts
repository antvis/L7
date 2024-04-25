import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'fujian',
    sleepTime: 500,
  },
  {
    name: 'variFlight',
    sleepTime: 500,
  },
];

describe('Gallery Snapshot', () => {
  generateCanvasTestCases('Gallery', TEST_CASES);
});
