import {
  GaodeMap,
  LayerPopup,
  PointLayer,
  Scene,
  LineLayer,
  // anchorType,
} from '@antv/l7';
import { featureCollection, point } from '@turf/turf';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [popup, setPopup] = useState<LayerPopup | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const pointLayer = new PointLayer({
        name: 'pointLayer',
      });
      pointLayer
        .source(
          featureCollection([
            point([120.104697, 30.260704], {
              name: '1',
            }),
            point([120.104697, 30.261715], {
              name: '2',
            }),
          ]),
        )
        .color('#ff0000')
        .size(10);
      const lineString = new LineLayer({
        name: 'lineLayer',
      });
      lineString
        .source(
          featureCollection([
            {
              type: 'Feature',
              properties: {
                name: 'luelue',
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [120.103615, 30.262026],
                  [120.103172, 30.261771],
                  [120.102697, 30.261934],
                ],
              },
            },
          ]),
        )
        .size(6)
        .color('#00ff00');
      newScene.addLayer(pointLayer);
      newScene.addLayer(lineString);
      const newPopup = new LayerPopup({
        config: [
          {
            layer: 'pointLayer',
            fields: [
              {
                field: 'name',
                fieldFormat: (key) => {
                  return '名称';
                },
                valueFormat: (value) => {
                  return '12345';
                },
              },
            ],
          },
          {
            layer: 'lineLayer',
            fields: ['name'],
          },
        ],
        trigger: 'click',
      });
      newScene.addPopup(newPopup);
      setPopup(newPopup);
      setScene(newScene);
    });
  }, []);

  return (
    <>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
