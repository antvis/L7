import image_frag from '../shader/image_frag.glsl';
import image_vert from '../shader/image_vert.glsl';
import Material from './material';
export default function ImageMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture }
    },
    vertexShader: image_vert,
    fragmentShader: image_frag,
    transparent: true
  });
  return material;
}
