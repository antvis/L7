import { expect } from 'chai';
import { registerModule, getModule } from '../../../src/util/shaderModule';

describe('test shader module', function() {

  const vs = `
    #define PI 3.14
  `;

  const commonModule = {
    vs,
    fs: vs
  };

  const module1 = {
    vs: `
      #pragma include "common"
    `,
    fs: ''
  };

  registerModule('common', commonModule);
  registerModule('module1', module1);

  it('should import a module correctly.', function() {
    const { vs, fs } = getModule('module1');
    expect(vs).eq('#define PI 3.14');
    expect(fs.replace(/(\s+)|(\n)+|(\r\n)+/g, '')).eqls('#ifdefGL_FRAGMENT_PRECISION_HIGHprecisionhighpfloat;#elseprecisionmediumpfloat;#endif');
  });

});
