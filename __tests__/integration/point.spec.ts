import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'billboard',
  },
  {
    name: 'column',
    sleepTime: 200,
  },
  {
    name: 'dot',
  },
  {
    name: 'fill',
  },
  {
    name: 'fill_image',
  },
  // {
  //   name: 'image',
  // },
  {
    name: 'text',
  },
];

describe('Point Snapshot', () => {
  generateCanvasTestCases('Point', TEST_CASES);
});
