import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';
const shaderslib = {
  pointShader: {
    fragment: point_frag,
    vertex: point_vert
  }
};
// for (const programName in shaderslib) {
//   const program = shaderslib[programName];
//   program.fragment = ShaderFactory.parseIncludes(program.fragment);
//   program.vertex = ShaderFactory.parseIncludes(program.vertex);
// }
export default shaderslib;
