import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { addLayers, useData } from './useLine';

export default () => {
  const { geoData } = useData();

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
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
        .scale('rate', {
          type: 'sequential', // he input domain and output range of a sequential scale always has exactly two elements, and the output range is typically specified as an interpolator rather than an array of values.
        })
        .shape('fill')
        .color('rate', ['#ffffcc', '#253494'])
        .style({
          opacity: 1,
        });

      scene.addLayer(layer);
      addLayers(geoData, scene, layer);
    }
    return () => {
      scene.destroy();
    };
  }, [geoData]);

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
