/**
 * @fileOverview 全局变量
 * @author dxq613
 */
// const Global = {};
const Global = {
  version: '____L7_VERSION____',
  scene: {
    mapType: 'AMAP',
    zoom: 5,
    center: [ 107.622, 39.266 ],
    minZoom: 0,
    maxZoom: 22,
    pitch: 0
  },
  trackable: true,
  animate: true,
  snapArray: [ 0, 1, 2, 4, 5, 10 ],
  height: 0,
  activeColor: 'rgb(255,255,191)',
  colors: [ 'rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)' ],
  // 指定固定 tick 数的逼近值
  snapCountArray: [ 0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10 ],
  size: 10000,
  sdfHomeUrl: 'http://visualtest.amap.com',
  scales: {
  }
};


module.exports = Global;
