import {
  generateColorRamp,
  generateColorRampKey,
  formatCategory,
  IColorRamp,
} from '../src/color';
const colors = [
  '#419bdf', // Water
  '#419bdf',

  '#397d49', // Tree
  '#397d49',

  '#88b053', // Grass
  '#88b053',

  '#7a87c6', // vegetation
  '#7a87c6',

  '#e49635', // Crops
  '#e49635',

  '#dfc35a', // shrub
  '#dfc35a',

  '#c4281b', // Built Area
  '#c4281b',

  '#a59b8f', // Bare ground
  '#a59b8f',

  '#a8ebff', // Snow
  '#a8ebff',

  '#616161', // Clouds
  '#616161'
];
const positions = [
  0.0,
  0.1,
  0.1,
  0.2,
  0.2,
  0.3,
  0.3,
  0.4,
  0.4,
  0.5,
  0.5,
  0.6,
  0.6,
  0.7,
  0.7,
  0.8,
  0.8,
  0.9,
  0.9,
  1.0
];
const rampColors =  {
  'Water': '#419bdf',
  'Tree': '#397d49',
  'Grass': '#88b053',
  'vegetation': '#7a87c6',
  'Crops': '#e49635',
  'shrub': '#dfc35a',
  'Built Area': '#c4281b',
  'Bare ground': '#a59b8f',
  'Snow': '#a8ebff',
  'Clouds': '#616161',
} as IColorRamp;
describe('generateColorTexture', () => {
  it('key', () => {
    const key1 = generateColorRampKey(rampColors);
    const key2 = generateColorRampKey({
      colors,
      positions
    })
 
    expect(key1).toEqual('#419bdf_#397d49_#88b053_#7a87c6_#e49635_#dfc35a_#c4281b_#a59b8f_#a8ebff_#616161_#616161_0_0.1_0.1_0.2_0.2_0.30000000000000004_0.30000000000000004_0.4_0.4_0.5_0.5_0.6000000000000001_0.6000000000000001_0.7000000000000001_0.7000000000000001_0.8_0.8_0.9_0.9_1_0.9_1');
    expect(key2).toEqual('#419bdf_#419bdf_#397d49_#397d49_#88b053_#88b053_#7a87c6_#7a87c6_#e49635_#e49635_#dfc35a_#dfc35a_#c4281b_#c4281b_#a59b8f_#a59b8f_#a8ebff_#a8ebff_#616161_#616161_0_0.1_0.1_0.2_0.2_0.3_0.3_0.4_0.4_0.5_0.5_0.6_0.6_0.7_0.7_0.8_0.8_0.9_0.9_1');
  });

  it('texture', () => {
    const d1 = generateColorRamp({
      c1: '#f00',
      c2: '#ff0'
    })
    expect(d1.data.length).toEqual(1024);
  })

  it('cat', () => {
    const list = formatCategory({
      water: '#f00',
      land: [0.2, 0.3, '#ff0'],
      land2: [0.35, 0.4, '#ddd'],
      wood: '#0f0',
      city: '#ccc',
      city2: [0.9, 0.95, '#0ff']
    })
    expect(list).toEqual([
      [ 0, 0.2, '#f00' ],
      [ 0.2, 0.3, '#ff0' ],
      [ 0.3, 0.35, null ],
      [ 0.35, 0.4, '#ddd' ],
      [ 0.4, 0.65, '#0f0' ],
      [ 0.65, 0.9, '#ccc' ],
      [ 0.9, 1, '#0ff' ]
    ])
  })
});
