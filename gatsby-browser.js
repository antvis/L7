
import './packages/component/src/css/l7.css';
import './site/css/demo.css'
require('./packages/component/src/css/l7.css');
// window.GeoTIFF = require('geotiff/dist/geotiff.bundle.js')
window.scene = require('./packages/scene/src');
window.layers= require('./packages/layers/src');
window.component= require('./packages/component/src');
window.g2plot = require('@antv/g2plot');
