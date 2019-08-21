import Material from './material';
import { getModule, wrapUniforms } from '../../util/shaderModule';
import merge from '@antv/util/lib/deep-mix';

export default function TextMaterial(_uniforms) {
  const { vs, fs, uniforms } = getModule('text');
  const material = new Material({
    defines: {
      SDF_PX: '8.0',
      EDGE_GAMMA: 0.105 / window.devicePixelRatio
    },
    uniforms: wrapUniforms(merge(uniforms, _uniforms)),
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}
