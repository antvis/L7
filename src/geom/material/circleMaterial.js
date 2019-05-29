import Material from './material';
import { getModule, wrapUniforms } from '../../util/shaderModule';
import merge from '@antv/util/lib/deep-mix';

export default class CircleMaterial extends Material {
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { vs, fs, uniforms } = getModule('circle');
    this.uniforms = wrapUniforms(merge(uniforms, _uniforms));
    this.defines = _defines;
    this.type = 'CircleMaterial';
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
