import {
  Scene,
  PolygonLayer,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/antfincdn/pRl7S2quof/source-geometry.json',
    )
      .then((response) => response.json())
      .then((data) => {
        const scene = new Scene({
          id: 'map',
          map: new GaodeMap({
            pitch: 0,
            center: [113.8623046875, 30.031055426540206],
            zoom: 3,
          }),
        });

        const layer = new PolygonLayer({})
          .source(data, {
            parser: { type: 'json', geometry: '_geometry' },
          })
          .shape('fill')
          .color('childrenNum', ['#0f9960', '#33a02c', '#377eb8'])
          .active(true)
          .style({});

        layer.on('mousemove', (event) => {
          console.log('event: ', event);
        });

        scene.on('loaded', () => {
          scene.addLayer(layer);
        });
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
