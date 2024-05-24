import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'extrude',
    sleepTime: 500,
  },
  {
    name: 'extrusion',
    sleepTime: 500,
  },
  {
    name: 'fill',
  },
  {
    name: 'ocean',
    snapshot: false,
  },
  {
    name: 'texture',
    snapshot: false,
  },
  {
    name: 'water',
    snapshot: false,
  },
];

describe('Polygon Snapshot', () => {
  generateCanvasTestCases('polygon', TEST_CASES);
});
