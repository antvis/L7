import * as THREE from '../../core/three';
import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';
export default function PointMaterial(options) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_stroke: { value: options.u_stroke },
      u_strokeWidth: { value: options.u_strokeWidth },
      u_texture: { value: options.u_texture }
    },
    vertexShader: point_vert,
    fragmentShader: point_frag,
    blending: THREE.NormalBlending,
    transparent: true,
    defines: {
      SHAPE: true,
      TEXCOORD_0: !!options.u_texture
    }
  });
  if (options.shape === false) {
    material.blending = THREE.AdditiveBlending;
  }
  return material;
}
