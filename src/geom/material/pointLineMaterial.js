import Material from './material';
import point_frag from '../shader/point_meshLine_frag.glsl';
import point_vert from '../shader/point_meshLine_vert.glsl';

export default class PointLineMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_strokeOpacity: { value: 1 },
        u_stroke: { value: [ 1.0, 1.0, 1.0, 1.0 ] },
        u_strokeWidth: { value: 1.0 },
        u_zoom: { value: 10 }

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms } = this.getDefaultParameters();

    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'PointLineMaterial';
    this.vertexShader = point_vert;
    this.fragmentShader = point_frag;
    this.transparent = true;
  }


}
