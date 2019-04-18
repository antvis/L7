import { expect } from 'chai';
import {Scene} from '../../../../src/core/scene';
import TileLayer from '../../../../src/layer/tile/tileLayer';

describe('tile layer', function() {

  const amapscript = document.createElement('script');
  amapscript.type = 'text/javascript';
  amapscript.src = 'https://webapi.amap.com/maps?v=1.4.8&key=15cd8a57710d40c9b7c0e3cc120f1200&plugin=Map3D';
  document.body.appendChild(amapscript);
  const div = document.createElement('div');
  div.id = 'map';
  div.style.cssText = 'width:500px;height:500px;position:absolute';
  document.body.appendChild(div);
  const scene = new Scene({
    id: 'map',
    mapStyle: 'light', // 样式URL
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 0,
    zoom: 2,
    maxZoom: 20,
    minZoom: 0
  });
  // const TileLayer = new TileLayer(null, {});
});
