import {
  expect
} from 'chai';
import Base from '../../../src/core/base';

describe('core base Test', function() {
  const base1 = new Base();
  it('test getDefaultcfg', function() {
    expect(base1.getDefaultCfg()).to.be.an('object');
  });
});
