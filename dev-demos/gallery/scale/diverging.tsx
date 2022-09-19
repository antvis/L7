import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { useEuropeData, addEuropeLayers } from './useLine';

export default () => {
  const { geoData } = useEuropeData();

  useEffect(() => {
    const scene = new Scene({
      id: 'map2',
      map: new Map({
        pitch: 0,
        style: 'light',
        center: [-96, 37.8],
        zoom: 3,
      }),
    });
    if (geoData) {
      const layer = new PolygonLayer({
        autoFit: true,
      })
        .source(geoData.country, {
          transforms: [
            {
              type: 'join',
              sourceField: 'country',
              targetField: 'NAME',
              data: geoData.turnout,
            },
          ],
        })
        .scale('turnout', {
          type: 'diverging', //  the input domain and output range of a diverging scale always has exactly three elements
          //   domain: [40, 70, 90],
        })
        .shape('fill')
        .color('turnout', ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de'])
        .style({
          opacity: 1,
        });

      scene.addLayer(layer);
      addEuropeLayers(geoData, scene, layer);
    }
    return () => {
      scene.destroy();
    };
  }, [geoData]);

  return (
    <div
      id="map2"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
