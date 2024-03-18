// @ts-ignore
import {
  PolygonLayer,
  Scene,
  // LineLayer,
  Source,
} from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [121.268, 30.3628],
        // zoom: 12,
        zoom: 4,
      }),
    });
    // https://mvt.amap.com/district/WLD/2/3/1/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=
    const url =
      'https://mvt.amap.com/district/WLD/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
    const source = new Source(url, {
      parser: {
        type: 'mvt',
        tileSize: 256,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    });

    scene.on('loaded', () => {
      // 绿地
      const water_surface = new PolygonLayer({
        sourceLayer: 'WLD',
      })
        .source(source)
        .shape('fill')
        .color('#9fd7fc');

      scene.addLayer(water_surface);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
