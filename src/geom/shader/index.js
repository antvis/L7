import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';
import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
import grid_frag from '../shader/grid_frag.glsl';
import grid_vert from '../shader/grid_vert.glsl';
import hexagon_frag from '../shader/hexagon_frag.glsl';
import hexagon_vert from '../shader/hexagon_vert.glsl';

// 点的边线
import point_line_frag from '../shader/point_meshLine_frag.glsl';
import point_line_vert from '../shader/point_meshLine_vert.glsl';

// 有宽度的线
import mesh_line_frag from '../shader/meshline_frag.glsl';
import mesh_line_vert from '../shader/meshline_vert.glsl';

// 原生线
import line_frag from '../shader/line_frag.glsl';
import line_vert from '../shader/line_vert.glsl';

// 虚线
import dash_vert from '../shader/dashline_vert.glsl';
import dash_frag from '../shader/dashline_frag.glsl';

// 热力图
import heatmap_color_vert from '../shader/heatmap_colorize_vert.glsl';
import heatmap_color_frag from '../shader/heatmap_colorize_frag.glsl';
import heatmap_intensity_frag from '../shader/heatmap_intensity_frag.glsl';
import heatmap_intensity_vert from '../shader/heatmap_intensity_vert.glsl';

// 文本
import text_frag from '../shader/text_frag.glsl';
import text_vert from '../shader/text_vert2.glsl';

// 图像
import image_vert from '../shader/image_vert.glsl';
import image_frag from '../shader/image_frag.glsl';

// 栅格
import raster_vert from '../shader/raster_vert.glsl';
import raster_frag from '../shader/raster_frag.glsl';

import common from './common.glsl';
import { registerModule } from '../../util/shaderModule';
import pick_color from './shaderChunks/pick_color.glsl';
export function compileBuiltinModules() {
  registerModule('point', { vs: point_vert, fs: point_frag });
  registerModule('common', { vs: common, fs: common });
  registerModule('pick_color', { vs: pick_color, fs: pick_color });
  registerModule('polygon', { vs: polygon_vert, fs: polygon_frag });
  registerModule('grid', { vs: grid_vert, fs: grid_frag });
  registerModule('hexagon', { vs: hexagon_vert, fs: hexagon_frag });
  registerModule('pointline', { vs: point_line_vert, fs: point_line_frag });
  registerModule('meshline', { vs: mesh_line_vert, fs: mesh_line_frag });
  registerModule('line', { vs: line_vert, fs: line_frag });
  registerModule('dashline', { vs: dash_vert, fs: dash_frag });
  registerModule('heatmap_color', { vs: heatmap_color_vert, fs: heatmap_color_frag });
  registerModule('heatmap_intensity', { vs: heatmap_intensity_vert, fs: heatmap_intensity_frag });
  registerModule('text', { vs: text_vert, fs: text_frag });
  registerModule('image', { vs: image_vert, fs: image_frag });
  registerModule('raster', { vs: raster_vert, fs: raster_frag });

}
