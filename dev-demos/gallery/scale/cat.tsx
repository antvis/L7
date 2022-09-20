import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { useData } from './useLine';

export default () => {
  const { geoData } = useData();

  useEffect(() => {
    const scene = new Scene({
      id: 'map1',
      map: new Map({
        pitch: 0,
        style: 'light',
        center: [-96, 37.8],
        zoom: 3,
      }),
    });
    if (geoData) {
      const layer = new PolygonLayer({})
        .source(geoData.county, {
          transforms: [
            {
              type: 'join',
              sourceField: 'id',
              targetField: 'id',
              data: geoData.unemploymentdata,
            },
          ],
        })
        .shape('fill')
        .color('name', [
          '#a6cee3',
          '#1f78b4',
          '#b2df8a',
          '#33a02c',
          '#fb9a99',
          '#e31a1c',
          '#fdbf6f',
          '#ff7f00',
          '#cab2d6',
          '#6a3d9a',
          '#ffff99',
          '#b15928',
        ])
        .style({
          opacity: 1,
        });

      scene.addLayer(layer);

      // addLayers(geoData, scene, layer);
    }
    return () => {
      scene.destroy();
    };
  }, [geoData]);

  return (
    <div
      id="map1"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
