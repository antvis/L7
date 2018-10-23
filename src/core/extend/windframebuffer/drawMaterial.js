
import Material from '../../../geom/material/material';
import draw_vert from './draw_vert.glsl';
import draw_frag from './draw_frag.glsl';
export default function DrawMaterial(options) {
  const material = new Material({
    uniforms: {
      u_color_ramp: { value: options.u_color_ramp },
      u_wind_max: { value: options.u_wind_max },
      u_particles_res: { value: options.u_particles_res },
      u_wind_min: { value: options.u_wind_min },
      u_opacity: { value: options.u_opacity },
      u_wind: { value: options.u_wind },
      u_particles: { value: options.u_particles },
      u_bbox: { value: options.u_bbox }
    },
    vertexShader: draw_vert,
    fragmentShader: draw_frag,
    transparent: true
  });
// material.blending = THREE.AdditiveBlending
  return material;
}
