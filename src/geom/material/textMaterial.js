import Material from './material';
import { getModule } from '../../util/shaderModule';

export default function TextMaterial(options) {
  const { vs, fs } = getModule('text');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_texture: { value: options.u_texture },
      u_strokeWidth: { value: options.u_strokeWidth },
      u_stroke: { value: options.u_stroke },
      u_textSize: { value: options.u_textSize },
      u_scale: { value: options.u_scale },
      u_gamma: { value: options.u_gamma },
      u_buffer: { value: options.u_buffer },
      u_color: { value: options.u_color },
      u_glSize: { value: options.u_glSize }

    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}
