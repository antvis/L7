import Material from './material';
import { getModule } from '../../util/shaderModule';
// export default function PolygonMaterial(options) {
//   const material = new Material({
//     uniforms: {
//       u_opacity: { value: options.u_opacity || 1.0 },
//       u_texture: { value: options.u_texture },
//       u_time: { value: options.u_time || 0 },
//       u_zoom: { value: options.u_zoom || 0 },
//       u_baseColor: { value: options.u_baseColor || [ 1.0, 0, 0, 1.0 ] },
//       u_brightColor: { value: options.u_brightColor || [ 1.0, 0, 0, 1.0 ] },
//       u_windowColor: { value: options.u_windowColor || [ 1.0, 0, 0, 1.0 ] },
//       u_near: { value: options.u_near || 0.0 },
//       u_far: { value: options.u_far || 1.0 }
//     },
//     vertexShader: polygon_vert,
//     fragmentShader: polygon_frag,
//     transparent: true,
//     defines: {
//       TEXCOORD_0: !!options.u_texture
//     }
//   });
//   return material;
// }

export default class PolygonMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1.0 },
        u_time: { value: 0 },
        u_zoom: { value: 0 },
        u_baseColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_brightColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_windowColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_near: { value: 0.0 },
        u_far: { value: 1.0 }
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'PolygonMaterial';
    this.defines = Object.assign(defines, _defines);

    const { vs, fs } = getModule('polygon');
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
