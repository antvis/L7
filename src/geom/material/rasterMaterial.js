import Material from './material';
import * as THREE from '../../core/three';
import raster_frag from '../shader/raster_frag.glsl';
import raster_vert from '../shader/raster_vert.glsl';
export default function ImageMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture },
      u_colorTexture: { value: options.u_colorTexture },
      u_min: { value: options.u_min },
      u_max: { value: options.u_max },
      u_extent: { value: options.u_extent },
      u_dimension: { value: options.u_dimension }

    },
    vertexShader: raster_vert,
    fragmentShader: raster_frag,
    transparent: false
  });
  // material.roughness = 1;
  // material.metalness = 0.1;
  // material.envMapIntensity = 3;
  return material;
}
