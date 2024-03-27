require('@/site/css/demo.css');
require('antd/dist/antd.less');

if (window) {
  (window as any).geotiff = require('geotiff');
  (window as any).lerc = require('lerc');
  (window as any).g2 = require('@antv/g2');
  (window as any).l7 = require('@antv/l7');
  (window as any).l7Maps = require('@antv/l7-maps');
  (window as any).l7plot = require('@antv/l7plot');
  (window as any).l7CompositeLayers = require('@antv/l7-composite-layers');
  (window as any).l7Draw = require('@antv/l7-draw');
  (window as any).l7Three = require('@antv/l7-three');
  (window as any).three = require('three');
  (window as any).GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader');
  (window as any).FBXLoader = require('three/examples/jsm/loaders/FBXLoader');
  (window as any).react = require('react');
  (window as any).popmotion = require('popmotion');
  (window as any).reactDom = require('react-dom');
  (window as any).antd = require('antd');
  (window as any).gcoord = require('gcoord');
  (window as any).pmtiles = require('pmtiles');
  (window as any).District = require('district-data');
}
