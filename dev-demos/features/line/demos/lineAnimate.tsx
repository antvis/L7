// @ts-ignore
import {
  LineLayer,
  Scene,
  Source,
  lineAtOffset,
  lineAtOffsetAsyc,
  PointLayer,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  // @ts-ignore
  useEffect(async () => {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/49a796db-944b-4c35-aa97-1015f0a407f1.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 40.258134],
        pitch: 0,
        zoom: 3,
        style: 'dark',
      }),
    });
    const data = await response.json();
    data.features = data.features.map((fe: any) => {
      if (fe.properties.saldo < 0) {
        fe.geometry.coordinates = fe.geometry.coordinates.reverse();
      }
      return fe;
    });
    const lineLayer = new LineLayer({
      blend: 'normal',
      autoFit: true,
    });
    lineLayer
      .source(data)
      .shape('line')
      .size('saldo', [0.4, 0.8])
      .color('saldo', (v) => {
        return v < 0 ? 'rgb(60,255,255)' : 'rgb(255,255,60)';
      })
      .animate({
        enable: true,
        interval: 0.1,
        duration: 3,
        trailLength: 0.2,
      })
      .style({
        opacity: 1,
      })
    scene.addLayer(lineLayer);
    // scene.render()
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
