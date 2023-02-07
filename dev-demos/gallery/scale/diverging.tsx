import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect, useState } from 'react';
import { addEuropeLayers, useEuropeData } from './useLine';

export default () => {
  const { geoData } = useEuropeData();
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    if (!scene) {
      const mapScene = new Scene({
        id: 'map',
        map: new Map({
          pitch: 0,
          style: 'light',
          center: [-96, 37.8],
          zoom: 3,
          interactive: true,
        }),
      });
      setScene(mapScene);
    }

    if (geoData && scene) {
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
        // .scale('turnout', {
        //   type: 'quantize', //  the input domain and output range of a diverging scale always has exactly three elements
        // //   domain: [40, 70, 90],
        // })
        .shape('fill')
        .color('turnout', [
          '#b2182b',
          '#f9b393',
          '#f8f6e9',
          '#9fc7e0',
          '#2166ac',
        ])
        .style({
          opacity: 1,
        });

      scene?.addLayer(layer);
      addEuropeLayers(geoData, scene, layer);
    }
    return () => {
      scene?.destroy();
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
