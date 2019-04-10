import * as THREE from '../../core/three';
import Material from './material';
import { getModule } from '../../util/shaderModule';
import arcline_frag from '../shader/arcline_frag.glsl';
import arcline_vert from '../shader/arcline_vert.glsl';


export function LineMaterial(options) {
  const { vs, fs } = getModule('line');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom || 10 },
      u_activeId: { value: options.activeId || 0 },
      u_activeColor: { value: options.activeColor || [ 1.0, 0, 0, 1.0 ] }
    },
    vertexShader: vs,
    fragmentShader: fs,
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
      u_zoom: { value: options.u_zoom || 10 },
      u_activeId: { value: options.activeId || 0 },
      u_activeColor: { value: options.activeColor || [ 1.0, 0, 0, 1.0 ] }
    },
    vertexShader: arcline_vert,
    fragmentShader: arcline_frag,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

export function MeshLineMaterial(options) {
  const { vs, fs } = getModule('meshline');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom },
      u_duration: { value: options.u_duration || 2.0 },
      u_interval: { value: options.u_interval || 1.0 },
      u_trailLength: { value: options.u_trailLength || 0.2 },
      u_activeId: { value: options.activeId || 0 },
      u_activeColor: { value: options.activeColor || [ 1.0, 0, 0, 1.0 ] }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}
export function DashLineMaterial(options) {
  const { vs, fs } = getModule('meshline');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom },
      u_dashSteps: { value: options.u_dashSteps || 12 },
      u_dashSmooth: { value: options.u_dashSmooth || 0.01 },
      u_dashDistance: { value: options.u_dashDistance || 0.2 },
      u_activeId: { value: options.activeId || 0 },
      u_activeColor: { value: options.activeColor || [ 1.0, 0, 0, 1.0 ] }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}

