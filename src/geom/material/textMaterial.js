import Material from './material';
import { getModule, wrapUniforms } from '../../util/shaderModule';
import merge from '@antv/util/lib/deep-mix';

export default function TextMaterial(_uniforms) {
  const { vs, fs, uniforms } = getModule('text');
  const material = new Material({
    defines: {
      DEVICE_PIXEL_RATIO: window.devicePixelRatio
    },
    uniforms: wrapUniforms(merge(uniforms, _uniforms)),
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}
