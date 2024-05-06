import { generateCanvasTestCases } from './utils/generator';

const TEST_CASES = [
  {
    name: 'extrude',
    sleepTime: 1000,
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
    snapshots: false,
  },
  {
    name: 'texture',
    snapshots: false,
  },
  {
    name: 'water',
    snapshots: false,
  },
];

describe('Polygon Snapshot', () => {
  generateCanvasTestCases('Polygon', TEST_CASES);
});
