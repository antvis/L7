import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';
import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
import common from './common.glsl';
import { registerModule } from '../../util/shaderModule';
import pick_color from './shaderChunks/pick_color.glsl';
export function compileBuiltinModules() {
  registerModule('point', { vs: point_vert, fs: point_frag });
  registerModule('common', { vs: common, fs: common });
  registerModule('pick_color', { vs: pick_color, fs: pick_color });
  registerModule('polygon', { vs: polygon_vert, fs: polygon_frag });
}
