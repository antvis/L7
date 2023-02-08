import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { addLayers, useData } from './useLine';

export default () => {
  const { geoData } = useData();

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
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
          type: 'quantile',
        })
        .shape('fill')
        .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494'])
        .style({
          opacity: 1,
        });

      layer.on('mousemove', (e) => {
        console.log(e);
      });
      scene.addLayer(layer);
      addLayers(geoData, scene, layer);
    }
    return () => {
      console.log(111);
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
