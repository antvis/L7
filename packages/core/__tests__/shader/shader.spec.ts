import type { IShaderModuleService } from '../../src/services/shader/IShaderModuleService';
import ShaderModuleService from '../../src/services/shader/ShaderModuleService';

describe('ShaderService', () => {
  let shaderService: IShaderModuleService;

  beforeEach(() => {
    shaderService = new ShaderModuleService();
  });

  it('should register common module correctly and generate proper fragment/vertex shader code', () => {
    const rawShaderCode = `
      #define PI 3.14
    `;

    const commonModule = {
      fs: rawShaderCode,
      vs: rawShaderCode,
    };
    shaderService.registerModule('common', commonModule);

    const { vs, fs } = shaderService.getModule('common');

    expect(vs).toMatch(/3\.14/);
    expect(fs).toMatch(/3\.14/);

    expect(fs).toMatch(/precision mediump float;/);
  });
});
