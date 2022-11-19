import type { RasterLayerProps } from '@antv/larkmap';
import { LarkMap, RasterLayer } from '@antv/larkmap';
import React, { useState } from 'react';

const layerOptions: Omit<RasterLayerProps, 'source'> = {
  autoFit: true,
  style: {
    domain: [0, 256],
    clampLow: true,
    rampColors: {
      colors: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
      positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
    },
  },
};

const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const layerSource = {
  data: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
};

export default () => {
  const [options, setOptions] = useState(layerOptions);

  const config = {
    mapType: 'Map' as const,
    mapOptions: {
      center: [120.210792, 30.246026] as [number, number],
      zoom: 9,
    },
  };
  return (
    <LarkMap {...config} style={{ height: '300px' }}>
      <RasterLayer {...options} source={layerSource} />
    </LarkMap>
  );
};