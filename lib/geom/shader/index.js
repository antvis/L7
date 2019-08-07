"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileBuiltinModules = compileBuiltinModules;

var _point_frag = _interopRequireDefault(require("../shader/point_frag.glsl"));

var _point_vert = _interopRequireDefault(require("../shader/point_vert.glsl"));

var _polygon_frag = _interopRequireDefault(require("../shader/polygon_frag.glsl"));

var _polygon_vert = _interopRequireDefault(require("../shader/polygon_vert.glsl"));

var _grid_frag = _interopRequireDefault(require("../shader/grid_frag.glsl"));

var _grid_vert = _interopRequireDefault(require("../shader/grid_vert.glsl"));

var _hexagon_frag = _interopRequireDefault(require("../shader/hexagon_frag.glsl"));

var _hexagon_vert = _interopRequireDefault(require("../shader/hexagon_vert.glsl"));

var _circle_frag = _interopRequireDefault(require("./circle_frag.glsl"));

var _circle_vert = _interopRequireDefault(require("./circle_vert.glsl"));

var _point_meshLine_frag = _interopRequireDefault(require("../shader/point_meshLine_frag.glsl"));

var _point_meshLine_vert = _interopRequireDefault(require("../shader/point_meshLine_vert.glsl"));

var _normal_point_frag = _interopRequireDefault(require("./normal_point_frag.glsl"));

var _normal_point_vert = _interopRequireDefault(require("./normal_point_vert.glsl"));

var _meshline_frag = _interopRequireDefault(require("../shader/meshline_frag.glsl"));

var _meshline_vert = _interopRequireDefault(require("../shader/meshline_vert.glsl"));

var _arcline_frag = _interopRequireDefault(require("../shader/arcline_frag.glsl"));

var _arcline_vert = _interopRequireDefault(require("../shader/arcline_vert.glsl"));

var _great_circle_line_vert = _interopRequireDefault(require("../shader/great_circle_line_vert.glsl"));

var _line_frag = _interopRequireDefault(require("../shader/line_frag.glsl"));

var _line_vert = _interopRequireDefault(require("../shader/line_vert.glsl"));

var _heatmap_colorize_vert = _interopRequireDefault(require("../shader/heatmap_colorize_vert.glsl"));

var _heatmap_colorize_frag = _interopRequireDefault(require("../shader/heatmap_colorize_frag.glsl"));

var _heatmap_intensity_frag = _interopRequireDefault(require("../shader/heatmap_intensity_frag.glsl"));

var _heatmap_intensity_vert = _interopRequireDefault(require("../shader/heatmap_intensity_vert.glsl"));

var _text_frag = _interopRequireDefault(require("../shader/text_frag.glsl"));

var _text_vert = _interopRequireDefault(require("../shader/text_vert.glsl"));

var _image_vert = _interopRequireDefault(require("../shader/image_vert.glsl"));

var _image_frag = _interopRequireDefault(require("../shader/image_frag.glsl"));

var _raster_vert = _interopRequireDefault(require("../shader/raster_vert.glsl"));

var _raster_frag = _interopRequireDefault(require("../shader/raster_frag.glsl"));

var _polygon_vert2 = _interopRequireDefault(require("../shader/tile/polygon_vert.glsl"));

var _polygon_frag2 = _interopRequireDefault(require("../shader/tile/polygon_frag.glsl"));

var _mask_quard_vert = _interopRequireDefault(require("../shader/tile/mask_quard_vert.glsl"));

var _mask_quard_frag = _interopRequireDefault(require("../shader/tile/mask_quard_frag.glsl"));

var _common = _interopRequireDefault(require("./common.glsl"));

var _shaderModule = require("../../util/shaderModule");

var _pick_color = _interopRequireDefault(require("./shaderChunks/pick_color.glsl"));

var _decode = _interopRequireDefault(require("./shaderChunks/decode.glsl"));

var _lighting = _interopRequireDefault(require("./shaderChunks/lighting.glsl"));

var _pick = _interopRequireDefault(require("./shaderChunks/pick.glsl"));

var _sdf_2d = _interopRequireDefault(require("./shaderChunks/sdf_2d.glsl"));

var _project = _interopRequireDefault(require("./shaderChunks/project.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 点的边线
// 原生点
// 有宽度的线
// arc line
// 原生线
// 热力图
// 文本
// 图像
// 栅格
// tile
// mask
function compileBuiltinModules() {
  (0, _shaderModule.registerModule)('point', {
    vs: _point_vert["default"],
    fs: _point_frag["default"]
  });
  (0, _shaderModule.registerModule)('common', {
    vs: _common["default"],
    fs: _common["default"]
  });
  (0, _shaderModule.registerModule)('decode', {
    vs: _decode["default"],
    fs: ''
  });
  (0, _shaderModule.registerModule)('lighting', {
    vs: _lighting["default"],
    fs: ''
  });
  (0, _shaderModule.registerModule)('pick', {
    vs: '',
    fs: _pick["default"]
  });
  (0, _shaderModule.registerModule)('sdf_2d', {
    vs: '',
    fs: _sdf_2d["default"]
  });
  (0, _shaderModule.registerModule)('project', {
    vs: _project["default"],
    fs: ''
  });
  (0, _shaderModule.registerModule)('pick_color', {
    vs: _pick_color["default"],
    fs: _pick_color["default"]
  });
  (0, _shaderModule.registerModule)('circle', {
    vs: _circle_vert["default"],
    fs: _circle_frag["default"]
  });
  (0, _shaderModule.registerModule)('polygon', {
    vs: _polygon_vert["default"],
    fs: _polygon_frag["default"]
  });
  (0, _shaderModule.registerModule)('grid', {
    vs: _grid_vert["default"],
    fs: _grid_frag["default"]
  });
  (0, _shaderModule.registerModule)('hexagon', {
    vs: _hexagon_vert["default"],
    fs: _hexagon_frag["default"]
  });
  (0, _shaderModule.registerModule)('pointline', {
    vs: _point_meshLine_vert["default"],
    fs: _point_meshLine_frag["default"]
  });
  (0, _shaderModule.registerModule)('pointnormal', {
    vs: _normal_point_vert["default"],
    fs: _normal_point_frag["default"]
  });
  (0, _shaderModule.registerModule)('meshline', {
    vs: _meshline_vert["default"],
    fs: _meshline_frag["default"]
  });
  (0, _shaderModule.registerModule)('arcline', {
    vs: _arcline_vert["default"],
    fs: _arcline_frag["default"]
  });
  (0, _shaderModule.registerModule)('greatcircle', {
    vs: _great_circle_line_vert["default"],
    fs: _arcline_frag["default"]
  });
  (0, _shaderModule.registerModule)('line', {
    vs: _line_vert["default"],
    fs: _line_frag["default"]
  });
  (0, _shaderModule.registerModule)('heatmap_color', {
    vs: _heatmap_colorize_vert["default"],
    fs: _heatmap_colorize_frag["default"]
  });
  (0, _shaderModule.registerModule)('heatmap_intensity', {
    vs: _heatmap_intensity_vert["default"],
    fs: _heatmap_intensity_frag["default"]
  });
  (0, _shaderModule.registerModule)('text', {
    vs: _text_vert["default"],
    fs: _text_frag["default"]
  });
  (0, _shaderModule.registerModule)('image', {
    vs: _image_vert["default"],
    fs: _image_frag["default"]
  });
  (0, _shaderModule.registerModule)('raster', {
    vs: _raster_vert["default"],
    fs: _raster_frag["default"]
  });
  (0, _shaderModule.registerModule)('tilepolygon', {
    vs: _polygon_vert2["default"],
    fs: _polygon_frag2["default"]
  });
  (0, _shaderModule.registerModule)('mask_quard', {
    vs: _mask_quard_vert["default"],
    fs: _mask_quard_frag["default"]
  });
}