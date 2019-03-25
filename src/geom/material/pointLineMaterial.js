import Material from './material';
import { getModule } from '../../util/shaderModule';
export default class PointLineMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_strokeOpacity: { value: 1 },
        u_stroke: { value: [ 1.0, 1.0, 1.0, 1.0 ] },
        u_strokeWidth: { value: 1.0 },
        u_zoom: { value: 10 },
        u_activeId: { value: -1 },
        u_activeColor: { value: [ 1.0, 0, 0, 1.0 ] }

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms } = this.getDefaultParameters();
    const { vs, fs } = getModule('pointline');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'PointLineMaterial';
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }


}
