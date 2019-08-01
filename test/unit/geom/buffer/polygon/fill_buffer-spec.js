import { expect } from 'chai';
import FillBuffer from '../../../../../src/geom/buffer/polygon/fill_buffer';
import { layerData } from '../../../../asset/data/layer_data';
describe('FillBuffer', () => {
  it('fill buffer', () => {
    console.time('buffer');
    const fillBuffer = new FillBuffer({
      layerData
    });
    console.timeEnd('buffer');
    console.log(fillBuffer);
  });
});
