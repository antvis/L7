import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'billboard',
  },
  {
    name: 'column',
  },
  {
    name: 'fill_image',
  },
  {
    name: 'fill',
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
