
import {
  Scene,
  PolygonLayer,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        pitch: 40,
        center: [113.8623046875, 30.031055426540206],
        zoom: 7.5,
      }),
    });
    const data = {
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
                [116.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
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
                [115.3232421875, 30.031055426540206],
                [115.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
            ],
          },
        },
      ],
    };


    const layer = new PolygonLayer({})
      .source(data)
      .shape('fill')
      .color('red')
      .active(true)
      .style({
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);

      setTimeout(() =>{
        layer.setData(data2)
      }, 200)
      layer.on('mousemove', () =>{
        console.log('mousemove')
      })
      layer.on('unmousemove', () =>{
        console.log('unmousemove')
      })
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
