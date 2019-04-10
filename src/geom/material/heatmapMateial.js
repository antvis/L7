import * as THREE from '../../core/three';
import Material from './material';
import { getModule } from '../../util/shaderModule';
export class HeatmapColorizeMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_intensity: { value: 1.0 },
        u_texture: { value: null },
        u_rampColors: { value: 0 },
        u_opacity: { value: 1 }
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines = {}, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    const { vs, fs } = getModule('heatmap_color');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'HeatmapColorizeMaterial';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}

export class HeatmapIntensityMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_intensity: { value: 10.0 },
        u_zoom: { value: 4 },
        u_radius: { value: 10 }
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines = {}, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    const { vs, fs } = getModule('heatmap_intensity');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'heatmap_intensity';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = vs;
    this.blending = THREE.AdditiveBlending;
    this.fragmentShader = fs;
    this.depthTest = false;
    this.transparent = true;
  }
}

