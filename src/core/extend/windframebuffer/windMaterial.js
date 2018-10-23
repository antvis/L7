
import image_vert from './wind_vert.glsl';
import image_frag from './wind_frag.glsl';
import Material from '../../../geom/material/material';
export default function WindMaterial(options) {
  const material = new Material({
    uniforms: {
      u_texture: { value: options.u_texture },
      u_opacity: { value: options.u_opacity }
    },
    vertexShader: image_vert,
    fragmentShader: image_frag,
    transparent: true
  });
// material.blending = THREE.AdditiveBlending
  return material;
}
