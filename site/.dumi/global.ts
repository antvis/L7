import '@/site/css/demo.css';

import * as geotiff from 'geotiff';
// @ts-ignore: no types for lerc
import * as g2 from '@antv/g2';
import * as l7 from '@antv/l7';
import * as l7CompositeLayers from '@antv/l7-composite-layers';
import * as l7Draw from '@antv/l7-draw';
import * as l7Maps from '@antv/l7-maps';
import * as l7Three from '@antv/l7-three';
import * as l7plot from '@antv/l7plot';
import * as antd from 'antd';
import * as District from 'district-data';
import * as gcoord from 'gcoord';
import * as lerc from 'lerc';
import * as pmtiles from 'pmtiles';
import * as popmotion from 'popmotion';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

if (typeof window !== 'undefined') {
  (window as any).geotiff = geotiff;
  (window as any).lerc = lerc;
  (window as any).g2 = g2;
  (window as any).l7 = l7;
  (window as any).l7Maps = l7Maps;
  (window as any).l7plot = l7plot;
  (window as any).l7CompositeLayers = l7CompositeLayers;
  (window as any).l7Draw = l7Draw;
  (window as any).l7Three = l7Three;
  (window as any).three = THREE;
  (window as any).GLTFLoader = GLTFLoader;
  (window as any).FBXLoader = FBXLoader;
  (window as any).react = React;
  (window as any).popmotion = popmotion;
  (window as any).reactDom = ReactDOM;
  (window as any).antd = antd;
  (window as any).gcoord = gcoord;
  (window as any).pmtiles = pmtiles;
  (window as any).District = District;
}
