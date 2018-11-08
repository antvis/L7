import * as THREE from '../../core/three';
import line_frag from '../shader/line_frag.glsl';
import line_vert from '../shader/line_vert.glsl';
import Material from './material';
import arcline_frag from '../shader/arcline_frag.glsl';
import arcline_vert from '../shader/arcline_vert.glsl';
export function LineMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 }
    },
    vertexShader: line_vert,
    fragmentShader: line_frag,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}
export function ArcLineMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      segmentNumber: { value: 50 }
    },
    vertexShader: arcline_vert,
    fragmentShader: arcline_frag,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

