import type { IJsonData } from '../../src/interface';
const data1: IJsonData = [
  {
    lng: 112.323,
    lat: 30.456,
    name: 'dog',
  },
  {
    lng: 112.323,
    lat: 30.456,
    name: 'cat',
  },
];
const data2: IJsonData = [
  {
    coord: [112.323, 30.456],
    name: 'dog',
  },
  {
    coord: [110.234, 1234],
    name: 'cat',
  },
];
export { data1, data2 };
