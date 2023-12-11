import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap,Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
    renderer: process.env.renderer,
      map: new GaodeMap({
        center: [115, 30.258134],
        pitch: 40,
        zoom: 6,
      }),
    });
    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [113.8623046875, 30.031055426540206],
                [116.3232421875, 30.031055426540206],
                [117, 30],
                [117, 31],
                [116, 30.5],
              ],
            ],
          },
        },
      ],
    };
    scene.addImage(
      '02',
      'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
    );
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json'
      )
        .then(res => res.json())
        .then(data => {
          const layer = new LineLayer({autoFit: true})
            .source(geoData)
            .size(40)
            .shape('wall')
            .style({
              opacity:{field:'testOpacity'},
              sourceColor: '#0DCCFF',
              targetColor: 'rbga(255,255,255, 0)'
            });
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
