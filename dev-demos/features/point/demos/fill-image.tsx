import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'point_fillImage',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        style: 'light',
        center: [120, 30],
        pitch: 60,
        zoom: 14,
      }),
    });

    scene.addImage(
      'marker',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
    );

    const pointLayer = new PointLayer({ layerType: 'fillImage' })
      .source(
        [
          {
            lng: 120,
            lat: 30,
            name: 'marker',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .style({
        unit: 'meter',
      })
      .shape('marker')
      .size(36);

    const pointLayer2 = new PointLayer({ layerType: 'fillImage' })
      .source(
        [
          {
            lng: 120,
            lat: 30,
            name: 'marker',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('marker')
      .size(36)
      .active(true)
      .style({
        rotation: 90,
      });

    scene.on('loaded', () => {
      scene.addLayer(pointLayer);
      scene.addLayer(pointLayer2);
      // scene.startAnimate();
    });
  }, []);
  return (
    <div
      id="point_fillImage"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
