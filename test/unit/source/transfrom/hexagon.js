import { expect } from 'chai';
import { pointData } from '../../../asset/data/point';
import { pointToHexbin } from '../../../../src/source/transform/hexagon';
describe('hexagon  Test', function() {

  it('pointToHexbin', function() {
    const dataArray = pointData.map(item => {
      const lng = 1e-6 * (250 * item.grid_x + 125),
        lat = 1e-6 * (250 * item.grid_y + 125);
      return {
        v: item.count * 1,
        coordinates: [ lng, lat ]
      };
    });

    const data = {
      dataArray
    };
    const hexgonGrid = pointToHexbin(data, { size: 100, field: 'count', method: 'sum' });
  });
});
