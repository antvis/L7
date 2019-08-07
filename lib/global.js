"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _version = _interopRequireDefault(require("./util/version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview 全局变量
 * @author dxq613
 */
// const Global = {};
var FONT_FAMILY = '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"';
var Global = {
  version: _version["default"],
  scene: {
    mapType: 'AMAP',
    zoom: 5,
    center: [107.622, 39.266],
    minZoom: 0,
    maxZoom: 22,
    pitch: 0,
    hash: false
  },
  animate: true,
  height: 0,
  activeColor: '#2f54eb',
  colors: ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)'],
  size: 10000,
  shape: 'circle',
  pattern: '',
  snapArray: [0, 1, 2, 4, 5, 10],
  pointShape: {
    '2d': ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'],
    '3d': ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn']
  },
  sdfHomeUrl: 'https://sdf.amap.com',
  scales: {},
  textStyle: {
    fontSize: 12,
    fill: '#ccc',
    textBaseline: 'middle',
    fontFamily: FONT_FAMILY,
    textAlign: 'center'
  }
};
var _default = Global;
exports["default"] = _default;