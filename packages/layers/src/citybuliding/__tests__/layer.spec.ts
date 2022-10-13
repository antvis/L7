import CityBuildingLayer from '../building';
describe('CityBuildingLayer', () => {
  const layer = new CityBuildingLayer({
    name: 'layer',
  });

  it('init', () => {
    expect(layer.type).toEqual('CityBuildingLayer');
  });
});
