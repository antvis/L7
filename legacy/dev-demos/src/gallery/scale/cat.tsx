import { PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect, useState } from 'react';
import { useData } from './useLine';

export default () => {
  const { geoData } = useData();
  const [mapScene, setMapScene] = useState<Scene>();

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
    scene.on('loaded', () => {
      setMapScene(scene);
    });
    return () => {
      mapScene?.destroy();
    };
  }, []);

  useEffect(() => {
    if (geoData && mapScene) {
      console.log(geoData, mapScene);
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

      mapScene.addLayer(layer);
      // addLayers(geoData, scene, layer);
    }
  }, [geoData, mapScene]);

  return (
    <div
      id="map"
      style={{
        height: '200px',
        position: 'relative',
      }}
    />
  );
};
