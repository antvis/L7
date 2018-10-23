import Material from '../../../geom/material/material';
import quad_vert from './quad.vert.glsl';
import update_frag from './update_frag.glsl';
export default function UpdateMaterial(options) {
  const material = new Material({
    uniforms: {
      u_wind_max: { value: options.u_wind_max },
      u_particles_res: { value: options.u_particles_res },
      u_wind_min: { value: options.u_wind_min },
      u_opacity: { value: options.u_opacity },
      u_wind: { value: options.u_wind },
      u_particles: { value: options.u_particles },
      u_drop_rate_bump: { value: options.u_drop_rate_bump },
      u_drop_rate: { value: options.u_drop_rate },
      u_speed_factor: { value: options.u_speed_factor },
      u_rand_seed: { value: options.u_rand_seed },
      u_extent: { value: options.u_extent },
      u_wind_res: { value: options.u_wind_res }
    },
    vertexShader: quad_vert,
    fragmentShader: update_frag,
    transparent: true
  });
// material.blending = THREE.AdditiveBlending
  return material;
}
