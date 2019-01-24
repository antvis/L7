import * as THREE from '../../core/three';
import Material from './material';
import line_frag from '../shader/line_frag.glsl';
import line_vert from '../shader/line_vert.glsl';
import arcline_frag from '../shader/arcline_frag.glsl';
import arcline_vert from '../shader/arcline_vert.glsl';
import meshline_vert from '../shader/meshline_vert.glsl';
import meshline_frag from '../shader/meshline_frag.glsl';
import dashline_frag from '../shader/dashline_frag.glsl';
import dashline_vert from '../shader/dashline_vert.glsl';


export function LineMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom || 10 }
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
      segmentNumber: { value: 49 },
      u_time: { value: 0 },
      u_zoom: { value: options.u_zoom || 10 }
    },
    vertexShader: arcline_vert,
    fragmentShader: arcline_frag,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

export function MeshLineMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom },
      u_duration: { value: options.u_duration || 2.0 },
      u_interval: { value: options.u_interval || 1.0 },
      u_trailLength: { value: options.u_trailLength || 0.2 }
    },
    vertexShader: meshline_vert,
    fragmentShader: meshline_frag,
    transparent: true
  });
  return material;
}
export function DashLineMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom },
      u_dashSteps: { value: options.u_dashSteps || 12 },
      u_dashSmooth: { value: options.u_dashSmooth || 0.01 },
      u_dashDistance: { value: options.u_dashDistance || 0.2 }
    },
    vertexShader: dashline_vert,
    fragmentShader: dashline_frag,
    transparent: true
  });
  return material;
}

