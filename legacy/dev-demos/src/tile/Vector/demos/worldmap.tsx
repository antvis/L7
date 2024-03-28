// @ts-ignore
import {
  Scene,
  Source,
  PolygonLayer,
  LineLayer,
  TileDebugLayer,
  PointLayer,
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { data } from './data';

export default () => {
  useEffect(() => {
    const counts = [10000, 5000, 1000, 500, 100];
    const color = [
      '#e41a1c',
      '#377eb8',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
    ];
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [100, 30],
        // zoom: 12,
        minZoom: 0,
        zoom: 2,
      }),
    });

    const url =
      'https://mvt.amap.com/district/WLD/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
    const source = new Source(url, {
      parser: {
        type: 'mvt',
        tileSize: 256,
        warp: false,
      },
    });
    function unicode2Char(name) {
      const code = name
        .split('/')
        .slice(1)
        .map((c) => {
          return String.fromCharCode('0x' + c);
        });
      return code.join('');
    }

    scene.on('loaded', () => {
      // 绿地
      const water_surface = new PolygonLayer({
        sourceLayer: 'WLD',
        zIndex: 1,
      })
        .source(source)
        .select(true)
        .active(false)
        .shape('fill')
        .color('NAME_CHN', (NAME_CHN) => {
          const namestr = unicode2Char(NAME_CHN);
          const country = data.find((c) => {
            return c.name == namestr;
          });
          if (!country) {
            return '#ffff33';
          }
          const qz = ((country.qz as unknown) as number) * 1;
          if (qz > counts[0]) {
            return color[0];
          } else if (qz > counts[1]) {
            return color[1];
          } else if (qz > counts[2]) {
            return color[2];
          } else if (qz > counts[3]) {
            return color[3];
          } else {
            return color[4];
          }
        });
      const line = new LineLayer({
        sourceLayer: 'WLD_L',
        zIndex: 2,
      })
        .source(source)
        .shape('line')
        .size(0.6)
        .color('type', (t) => {
          if (t === '0') {
            return 'red';
          }
          if (t === '2') {
            return '#09f';
          }
          return '#fc9272';
        });

      // const text = new PointLayer({
      //   sourceLayer: 'WLD',
      //   blend: 'normal',
      //   zIndex: 10,
      // })
      //   .source(source)
      //   .shape('NAME_CHN', (NAME_CHN) => {
      //     return unicode2Char(NAME_CHN);
      //   })
      //   .size(12)
      //   .color('#000');

      water_surface.on('click', (e) => {
        console.log(e);
      });

      scene.addLayer(water_surface);
      // scene.addLayer(text);
      scene.addLayer(line);
      // scene.addLayer(debugerLayer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        backgroundColor: 'rgba(175,200,253)',
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
