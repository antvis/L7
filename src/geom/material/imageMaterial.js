import { getModule } from '../../util/shaderModule';
import Material from './material';
export default function ImageMaterial(options) {
  const { vs, fs } = getModule('image');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    depthTest: false
  });
  return material;
}
