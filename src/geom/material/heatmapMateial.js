import * as THREE from '../../core/three';
import Material from './material';
import { getModule } from '../../util/shaderModule';

export function HeatmapIntensityMaterial(opt) {
  const { vs, fs } = getModule('heatmap_intensity');
  const material = new Material({
    uniforms: {
      u_intensity: { value: opt.intensity },
      u_radius: { value: opt.radius },
      u_zoom: { value: opt.zoom }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  return material;
}

export function HeatmapColorizeMaterial(opt) {
  const { vs, fs } = getModule('heatmap_color');
  const material = new Material({
    uniforms: {
      u_texture: { value: opt.texture },
      u_colorRamp: { value: opt.colorRamp },
      u_opacity: { value: opt.opacity }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  return material;
}
