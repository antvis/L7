import * as THREE from '../../core/three';
import Material from './material';
import heatmap_intensity_vert from '../shader/heatmap_intensity_vert.glsl';
import heatmap_intensity_frag from '../shader/heatmap_intensity_frag.glsl';
import heatmap_colorize_vert from '../shader/heatmap_colorize_vert.glsl';
import heatmap_colorize_frag from '../shader/heatmap_colorize_frag.glsl';

export function HeatmapIntensityMaterial(opt) {
  const material = new Material({
    uniforms: {
      u_intensity: { value: opt.intensity },
      u_radius: { value: opt.radius },
      u_zoom: { value: opt.zoom }
    },
    vertexShader: heatmap_intensity_vert,
    fragmentShader: heatmap_intensity_frag,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

export function HeatmapColorizeMaterial(opt) {
  const material = new Material({
    uniforms: {
      u_texture: { value: opt.texture },
      u_colorRamp: { value: opt.colorRamp }
    },
    vertexShader: heatmap_colorize_vert,
    fragmentShader: heatmap_colorize_frag,
    transparent: true
  });
  return material;
}
