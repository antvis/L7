// @ts-ignore
import { LineLayer, Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [ 120.15, 30.3 ],
        zoom: 10,
        style: 'light'
      })
    });
    
    const pointLayer = new PointLayer()
      .source([{ lng: 120.155, lat: 30.31 }], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      })
      .shape('circle')
      .size(6000)
      .color('#f00')
      .animate(true)
      .style({
        unit: 'meter'
      });
    const lineLayer = new LineLayer({})
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  120.1863098144,
                  30.321915039121
                ],
                [
                  120.3401184082,
                  30.43446594614
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  120.19660949707033,
                  30.298796461361665
                ],
                [
                  120.31883239746092,
                  30.28041626667403
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  120.12245178222656,
                  30.29523927312319
                ],
                [
                  120.01808166503906,
                  30.261439550638762
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  120.15609741210938,
                  30.285159872426014
                ],
                [
                  120.14923095703124,
                  30.20626765511821
                ]
              ]
            }
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  120.10940551757812,
                  30.320136880604423
                ],
                [
                  120.01327514648438,
                  30.362803774813028
                ]
              ]
            }
          }
        ]
      }
      )
      .size(2)
      .shape('line')
      .style({
        arrow: {
          enable: true,
          arrowWidth: 4,
          arrowHeight: 4,
          tailWidth: 0.4
        }
      })
      .color('#f00');
    scene.on('loaded', () => {
      scene.addLayer(pointLayer);
      scene.addLayer(lineLayer);
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
