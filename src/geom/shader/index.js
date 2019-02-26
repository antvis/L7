import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';
import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
import common from './common.glsl';
import { registerModule } from '../../util/shaderModule';

export function compileBuiltinModules() {
  registerModule('point', { vs: point_vert, fs: point_frag });
  registerModule('common', { vs: common, fs: common });
  registerModule('polygon', { vs: polygon_vert, fs: polygon_frag });
}
