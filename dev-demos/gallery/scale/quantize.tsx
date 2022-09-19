import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { useData, addLayers } from './useLine';

export default () => {
  const { geoData } = useData();

  useEffect(() => {
    const scene = new Scene({
      id: 'map5',
      map: new Map({
        pitch: 0,
        style: 'light',
        center: [-96, 37.8],
        zoom: 3,
        minZoom: 4,
        maxZoom: 5,
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
          type: 'quantize',
        })
        .shape('fill')
        .color('rate', ['#ffffcc', '#b6e2b6', '#64c1c0', '#338cbb', '#253494']) // '#b6e2b6', '#64c1c0', '#338cbb',
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
      id="map5"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
