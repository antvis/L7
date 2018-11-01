import { expect } from 'chai';
import { LoadImage } from '../../../src/core/image';
describe('core LoadImage Test', function() {

  it('test create', function() {
    const image = new LoadImage();
    expect(image).to.be.an.instanceof(LoadImage);
  });

});
