import { expect } from 'chai';
import { pointData } from '../../../asset/data/point';
import { cluster } from '../../../../src/source/transform/cluster';
describe('hexagon  Test', function() {

  it('pointToCuster', function() {
    const dataArray = pointData.map(item => {
      const lng = 1e-6 * (250 * item.grid_x + 125),
        lat = 1e-6 * (250 * item.grid_y + 125);
      return {
        v: item.count * 1,
        coordinates: [ lng, lat ]
      };
    });

    const data = {
      dataArray,
      extent: [ -180, -85, 180, 85 ]
    };
    const grid = cluster(data, { radius: 40, field: 'v', zoom: 13 });
    expect(grid.dataArray.length).eql(26);
  });
});
