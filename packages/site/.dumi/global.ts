require('@/site/css/demo.css');
require('antd/dist/antd.less');
if (window) {
    window.geotiff = require('geotiff');
    window.lerc = require('lerc');
    window.g2 = require('@antv/g2');
    window.l7 = require('@antv/l7');
    window.l7Maps = require('@antv/l7-maps');
    window.l7plot = require('@antv/l7plot');
    window.l7CompositeLayers = require('@antv/l7-composite-layers');
    window.l7Draw = require('@antv/l7-draw');
    window.l7Three = require('@antv/l7-three');
    window.three = require('three');
    window.GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader');
    window.FBXLoader = require('three/examples/jsm/loaders/FBXLoader');
    window.react = require('react');
    window.popmotion = require('popmotion');
    window.reactDom = require('react-dom');
    window.antd = require('antd');
    window.gcoord = require('gcoord');
    window.pmtiles = require('pmtiles');
}