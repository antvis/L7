import Material from './material';
import { getModule, wrapUniforms } from '../../util/shaderModule';
import merge from '@antv/util/lib/deep-mix';

export default class PolygonMaterial extends Material {
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { vs, fs, uniforms } = getModule('polygon');
    this.uniforms = wrapUniforms(merge(uniforms, _uniforms));
    this.type = 'PolygonMaterial';
    this.defines = _defines;

    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
