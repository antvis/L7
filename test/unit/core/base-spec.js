import { expect } from 'chai';
import Base from '../../../src/core/base';
describe('core base Test', function() {
  const base1 = new Base();
  it('test getDefaultcfg', function() {
    expect(base1.getDefaultCfg()).to.be.an('object');
  });
  it('test get set', function() {
    base1.set('name', 'L7');
    const name = base1.get('name');
    expect(name).equal('L7');
  });
  it('test destroy', function() {
    base1.destroy();
    expect(base1.destroyed).eq(true);
  });

});
